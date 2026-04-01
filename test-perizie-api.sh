#!/usr/bin/env bash
set -euo pipefail

API_URL="${API_URL:-https://osservatorio.2dsviluppoimmobiliare.it/2d-perizie-api.php}"
API_TOKEN="${API_TOKEN:-2dVPro_gK9mP3xW8nQ_2026}"

RID="test-$(date +%s)"
TODAY="$(date +%F)"

header_auth=(-H "Authorization: Bearer ${API_TOKEN}" -H "Content-Type: application/json")

echo "== 1) Reachability / Unauthorized check =="
STATUS_UNAUTH="$(curl -sS -o /tmp/perizie_unauth.txt -w "%{http_code}" "${API_URL}?action=ping")"
echo "HTTP without token: ${STATUS_UNAUTH}"


echo "== 2) Auth ping =="
PING_BODY="$(curl -sS "${API_URL}?action=ping" "${header_auth[@]}")"
echo "Ping body: ${PING_BODY}"


echo "== 3) Save test perizia =="
PAYLOAD="$(cat <<JSON
{
  "id": "${RID}",
  "numeroPratica": "2D-TEST-2026",
  "stato": "bozza",
  "dataCreazione": "${TODAY}",
  "dataModifica": "${TODAY}",
  "datiIncarico": {
    "committenteNome": "Test Auto",
    "numeroPratica": "2D-TEST-2026",
    "dataSopralluogo": "${TODAY}",
    "dataPerizia": "${TODAY}",
    "committenteIndirizzo": "Via Test",
    "committenteCfPiva": "TEST",
    "finalita": [],
    "finalitaAltro": "",
    "peritoNome": "Domenico Dentamaro",
    "peritoQualifica": "Perito Immobiliare",
    "firmaUrl": ""
  },
  "datiImmobile": {
    "comune": "BARI"
  },
  "schedaTecnica": {
    "tipologia": "A"
  },
  "analisiMercato": {
    "prezzoMedioMq": 2500,
    "prezzoMin": 2200,
    "prezzoMax": 2800,
    "fonteDati": "OMI",
    "trimestreOMI": "1° trimestre",
    "annoOMI": "2026",
    "comparabili": [],
    "descrizioneMercato": "",
    "tendenzaMercato": "Stabile",
    "tempiMediVendita": "3-6 mesi",
    "domanda": "Media",
    "liquidabilita": "Media"
  },
  "metodiValutazione": {
    "comparativo": {"attivo": true, "superficieCommerciale": 100, "prezzeMedioMq": 2500, "coeffLocazione": 1, "coeffPiano": 1, "coeffStato": 1, "coeffEsposizione": 1, "peso": 100},
    "costoRicostruzione": {"attivo": false, "costoUnitarioRicostruzione": 0, "superficieRicostruzione": 0, "coeffDeprezzamento": 0, "valorAreaFondo": 0, "peso": 0},
    "trasformazione": {"attivo": false, "valoreDopoTrasformazione": 0, "costiTrasformazione": 0, "utilePromozione": 0, "peso": 0},
    "capitalizzazione": {"attivo": false, "redditoAnnuoLordo": 0, "tassoSfitto": 0, "speseGestione": 0, "tassoCapitalizzazione": 0, "peso": 0}
  },
  "foto": [],
  "sezioniTestuali": [],
  "completamento": {"incarico": 0, "immobile": 0, "tecnica": 0, "mercato": 0, "valutazione": 0, "foto": 0, "relazione": 0}
}
JSON
)"

SAVE_BODY="$(curl -sS -X POST "${API_URL}?action=save" "${header_auth[@]}" -d "${PAYLOAD}")"
echo "Save body: ${SAVE_BODY}"


echo "== 4) List includes test id =="
LIST_BODY="$(curl -sS "${API_URL}?action=perizie" "${header_auth[@]}")"
if echo "${LIST_BODY}" | grep -q "${RID}"; then
  echo "OK: test id found in list"
else
  echo "FAIL: test id NOT found in list"
  exit 1
fi


echo "== 5) Get test perizia =="
GET_BODY="$(curl -sS "${API_URL}?action=perizia&id=${RID}" "${header_auth[@]}")"
if echo "${GET_BODY}" | grep -q "2D-TEST-2026"; then
  echo "OK: perizia loaded"
else
  echo "FAIL: perizia not loaded correctly"
  exit 1
fi


echo "== 6) OMI lookup BARI =="
OMI_STATUS="$(curl -sS -o /tmp/perizie_omi.txt -w "%{http_code}" "${API_URL}?action=omi&comune=BARI&tipologia=A&anno=2025&semestre=1" "${header_auth[@]}")"
echo "OMI status: ${OMI_STATUS}"
head -c 250 /tmp/perizie_omi.txt | cat
printf "\n"

echo "== 6b) Geocode via+civico (gratis) =="
GEO_STATUS="$(curl -sS -o /tmp/perizie_geo.txt -w "%{http_code}" "${API_URL}?action=geocode&via=Via%20Sparano&civico=10&comune=Bari&provincia=BA" "${header_auth[@]}")"
echo "Geocode status: ${GEO_STATUS}"
head -c 250 /tmp/perizie_geo.txt | cat
printf "\n"


echo "== 7) Delete test perizia =="
DEL_BODY="$(curl -sS -X DELETE "${API_URL}?action=delete&id=${RID}" "${header_auth[@]}")"
echo "Delete body: ${DEL_BODY}"


echo "== 8) Verify delete =="
LIST_AFTER="$(curl -sS "${API_URL}?action=perizie" "${header_auth[@]}")"
if echo "${LIST_AFTER}" | grep -q "${RID}"; then
  echo "FAIL: test id still present after delete"
  exit 1
else
  echo "OK: test id removed"
fi

echo "\nALL TESTS PASSED"

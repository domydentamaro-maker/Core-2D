<?php

function visioni_dashboard_page(){

if ( isset( $_POST['visioni_run_quality_audit'] ) && check_admin_referer( 'visioni_run_quality_audit_action', 'visioni_run_quality_audit_nonce' ) ) {
	Visioni_Core_Manager::run_daily_quality_audit();
	echo '<div class="notice notice-success is-dismissible"><p>Audit qualità rigenerato con successo.</p></div>';
}

$immobili = wp_count_posts('immobili')->publish ?? 0;
$terreni_interni = wp_count_posts('terreno')->publish ?? 0;
$terreni_vetrina = wp_count_posts('terreni')->publish ?? 0;
$cantieri = wp_count_posts('cantieri')->publish ?? 0;
$clienti = wp_count_posts('cliente')->publish ?? 0;

$quality = Visioni_Core_Manager::get_quality_audit_report();

?>

<div class="wrap">

<h1>Dashboard Gestionale Visioni</h1>

<div style="display:flex;gap:20px;margin-top:30px">

<div style="background:#fff;padding:30px;width:200px">
<h3>Immobili</h3>
<p style="font-size:22px"><?php echo $immobili; ?></p>
</div>

<div style="background:#fff;padding:30px;width:200px">
<h3>Terreni Interni</h3>
<p style="font-size:22px"><?php echo $terreni_interni; ?></p>
</div>

<div style="background:#fff;padding:30px;width:200px">
<h3>Terreni Vetrina</h3>
<p style="font-size:22px"><?php echo $terreni_vetrina; ?></p>
</div>

<div style="background:#fff;padding:30px;width:200px">
<h3>Cantieri</h3>
<p style="font-size:22px"><?php echo $cantieri; ?></p>
</div>

<div style="background:#fff;padding:30px;width:200px">
<h3>Clienti</h3>
<p style="font-size:22px"><?php echo $clienti; ?></p>
</div>

<div style="margin-top:30px;background:#fff;padding:24px;max-width:860px;border:1px solid #dcdcde;border-radius:8px;">
<h2 style="margin-top:0;">Audit Qualità Dati</h2>

<form method="post" style="margin:12px 0 18px;">
<?php wp_nonce_field( 'visioni_run_quality_audit_action', 'visioni_run_quality_audit_nonce' ); ?>
<input type="hidden" name="visioni_run_quality_audit" value="1" />
<button type="submit" class="button button-primary">Esegui audit ora</button>
</form>

<?php if ( empty( $quality ) ) : ?>
<p>Nessun report disponibile al momento.</p>
<?php else : ?>
<p><strong>Ultimo audit:</strong> <?php echo esc_html( (string) ( $quality['generated_at'] ?? 'n.d.' ) ); ?></p>
<p>
<strong>Schede analizzate:</strong> <?php echo esc_html( (string) ( $quality['totals']['scanned'] ?? 0 ) ); ?> |
<strong>Incompleti:</strong> <?php echo esc_html( (string) ( $quality['totals']['incomplete'] ?? 0 ) ); ?> |
<strong>Senza coordinate:</strong> <?php echo esc_html( (string) ( $quality['totals']['missing_geo'] ?? 0 ) ); ?> |
<strong>Score medio:</strong> <?php echo esc_html( (string) ( $quality['totals']['avg_score'] ?? 0 ) ); ?>/100 |
<strong>Sotto soglia:</strong> <?php echo esc_html( (string) ( $quality['totals']['under_threshold'] ?? 0 ) ); ?>
</p>

<?php if ( ! empty( $quality['top_missing'] ) ) : ?>
<h3 style="margin-top:20px;">Top campi mancanti</h3>
<ul style="list-style:disc;margin-left:18px;">
<?php foreach ( (array) $quality['top_missing'] as $row ) : ?>
<li><?php echo esc_html( (string) ( $row['label'] ?? $row['field'] ?? 'campo' ) ); ?>: <?php echo esc_html( (string) ( $row['count'] ?? 0 ) ); ?></li>
<?php endforeach; ?>
</ul>
<?php endif; ?>
<?php endif; ?>
</div>

</div>

</div>

<?php

}
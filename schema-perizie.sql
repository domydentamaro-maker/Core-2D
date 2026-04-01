-- ================================================
-- 2D Perizie — Schema Database
-- Host:   db5020143481.hosting-data.io:3306
-- Utente: dbu4428002
-- ================================================
-- Esegui questo script dal pannello Database del hosting
-- oppure tramite phpMyAdmin / client MySQL CLI

-- Tabella perizie: dati principali + JSON completo
CREATE TABLE IF NOT EXISTS perizie (
    id             VARCHAR(36)   NOT NULL,
    numero_pratica VARCHAR(50)   NOT NULL,
    committente    VARCHAR(255),
    comune         VARCHAR(100),
    stato          ENUM('bozza','completata') DEFAULT 'bozza',
    data_creazione DATE,
    data_modifica  DATE,
    dati_json      LONGTEXT      NOT NULL,
    created_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_stato  (stato),
    INDEX idx_comune (comune),
    INDEX idx_data   (data_modifica)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabella cache quotazioni OMI (Agenzia Entrate)
CREATE TABLE IF NOT EXISTS omi_cache (
    id            INT           NOT NULL AUTO_INCREMENT,
    comune_nome   VARCHAR(100)  NOT NULL,
    anno          SMALLINT      NOT NULL,
    semestre      TINYINT       NOT NULL,
    tipologia     CHAR(3)       NOT NULL,
    fascia        VARCHAR(50),
    stato_conserv VARCHAR(50),
    prezzo_min    DECIMAL(10,2),
    prezzo_max    DECIMAL(10,2),
    cached_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_lookup (comune_nome, anno, semestre, tipologia)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

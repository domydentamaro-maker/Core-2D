<?php
/**
 * UPLOAD & DEPLOY SCRIPT per 2D Sviluppo Immobiliare
 * - Upload dist.zip in public/
 * - Accedi a questo script: https://www.2dsviluppoimmobiliare.it/deploy.php
 * - Clicca "DECOMPRESS"
 * - Script deletes itself automaticamente
 */

$uploadDir = __DIR__; // Cartella corrente = public/
$zipFile = $uploadDir . '/dist.zip';
$extractDir = $uploadDir;

// Se dist.zip non esiste, mostra form upload
if (!file_exists($zipFile)) {
    ?>
    <!DOCTYPE html>
    <html lang="it">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🚀 2D Deploy - Upload ZIP</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            .container {
                background: white;
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                padding: 40px;
                max-width: 500px;
                width: 100%;
            }
            h1 {
                color: #003366;
                margin-bottom: 10px;
                font-size: 28px;
            }
            .subtitle {
                color: #666;
                margin-bottom: 30px;
                font-size: 14px;
            }
            .upload-box {
                border: 2px dashed #667eea;
                border-radius: 8px;
                padding: 30px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s;
                background: #f8f9ff;
            }
            .upload-box:hover {
                border-color: #764ba2;
                background: #f0f2ff;
            }
            .upload-box input {
                display: none;
            }
            .upload-icon {
                font-size: 48px;
                margin-bottom: 15px;
            }
            .upload-text {
                color: #333;
                font-weight: 500;
                margin-bottom: 8px;
            }
            .upload-hint {
                color: #999;
                font-size: 12px;
            }
            button {
                width: 100%;
                padding: 12px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                margin-top: 20px;
                transition: transform 0.2s;
            }
            button:hover {
                transform: translateY(-2px);
            }
            button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            .success {
                background: #10b981;
            }
            .error {
                background: #ef4444;
            }
            .info {
                background: #3b82f6;
                padding: 15px;
                border-radius: 6px;
                color: white;
                margin-top: 20px;
                font-size: 13px;
                line-height: 1.6;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 2D Sviluppo Deploy</h1>
            <p class="subtitle">Upload dist.zip e decomprimi automaticamente</p>
            
            <form id="uploadForm" enctype="multipart/form-data">
                <div class="upload-box" onclick="document.getElementById('fileInput').click()">
                    <div class="upload-icon">📦</div>
                    <div class="upload-text">Clicca o trascina dist.zip</div>
                    <div class="upload-hint">File ZIP (max 10MB)</div>
                    <input type="file" id="fileInput" name="file" accept=".zip" required>
                </div>
                <button type="submit" id="uploadBtn">📤 Upload ZIP</button>
            </form>

            <div class="info">
                ℹ️ <strong>Istruzioni:</strong><br>
                1. Seleziona dist.zip<br>
                2. Clicca Upload<br>
                3. Script decomprirà automaticamente<br>
                4. Script si eliminerà da solo
            </div>
        </div>

        <script>
            const form = document.getElementById('uploadForm');
            const fileInput = document.getElementById('fileInput');
            const uploadBtn = document.getElementById('uploadBtn');

            // Drag & drop
            document.querySelector('.upload-box').addEventListener('dragover', (e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = '#764ba2';
            });
            document.querySelector('.upload-box').addEventListener('dragleave', (e) => {
                e.currentTarget.style.borderColor = '#667eea';
            });
            document.querySelector('.upload-box').addEventListener('drop', (e) => {
                e.preventDefault();
                fileInput.files = e.dataTransfer.files;
            });

            // Upload
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData();
                formData.append('file', fileInput.files[0]);

                uploadBtn.disabled = true;
                uploadBtn.textContent = '⏳ Upload in corso...';

                try {
                    const response = await fetch(window.location.href, {
                        method: 'POST',
                        body: formData
                    });
                    const result = await response.json();
                    
                    if (result.success) {
                        uploadBtn.textContent = '✅ Decompressione in corso...';
                        uploadBtn.classList.add('success');
                        setTimeout(() => location.reload(), 2000);
                    } else {
                        uploadBtn.textContent = '❌ Errore: ' + result.message;
                        uploadBtn.classList.add('error');
                        uploadBtn.disabled = false;
                    }
                } catch (e) {
                    uploadBtn.textContent = '❌ Errore upload';
                    uploadBtn.classList.add('error');
                    uploadBtn.disabled = false;
                }
            });
        </script>
    </body>
    </html>
    <?php
    exit;
}

// HANDLE UPLOAD & EXTRACTION
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
    $file = $_FILES['file'];
    $uploadedZip = $uploadDir . '/dist.zip';
    
    if ($file['error'] === 0 && move_uploaded_file($file['tmp_name'], $uploadedZip)) {
        // Decompress
        $zip = new ZipArchive();
        if ($zip->open($uploadedZip) === true) {
            // Extract dist/* content to current dir (removing dist/ prefix)
            for ($i = 0; $i < $zip->numFiles; $i++) {
                $stat = $zip->statIndex($i);
                $name = $stat['name'];
                
                // Skip dist/ folder itself, extract contents
                if (strpos($name, 'dist/') === 0) {
                    $newName = substr($name, 5); // Remove 'dist/' prefix
                    
                    if (!empty($newName)) { // Skip empty paths
                        $zip->renameIndex($i, $newName);
                    }
                }
            }
            
            $zip->extractTo($extractDir);
            $zip->close();
            unlink($uploadedZip);
            
            // Delete this script
            unlink(__FILE__);
            
            echo json_encode(['success' => true, 'message' => 'Deploy completato! Script eliminato.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Errore decompressione ZIP']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Errore upload file']);
    }
    exit;
}

// Se dist.zip esiste, mostra status decompress
?>
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎉 Deploy Completato</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            padding: 40px;
            max-width: 500px;
            width: 100%;
            text-align: center;
        }
        h1 {
            color: #10b981;
            font-size: 32px;
            margin-bottom: 15px;
        }
        .icon {
            font-size: 64px;
            margin-bottom: 20px;
        }
        p {
            color: #666;
            margin-bottom: 10px;
            line-height: 1.6;
        }
        .success-box {
            background: #ecfdf5;
            border: 2px solid #10b981;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
        }
        a {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 30px;
            background: #10b981;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            transition: background 0.3s;
        }
        a:hover {
            background: #059669;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">✅</div>
        <h1>Deploy Completato!</h1>
        
        <div class="success-box">
            <p><strong>dist.zip</strong> è stato decompresso con successo!</p>
            <p>Tutti i file sono ora in: <strong>public/</strong></p>
        </div>

        <p>Il sito è ora live con le ultime modifiche:</p>
        <ul style="list-style: none; color: #10b981; font-weight: 500;">
            <li>✅ ARIA labels (Accessibilità)</li>
            <li>✅ Contrast fix (WCAG AA)</li>
            <li>✅ Lazy loading immagini</li>
            <li>✅ Form Formspree integrato</li>
            <li>✅ Sitemaps XML</li>
        </ul>

        <a href="/">← Vai al sito</a>
    </div>
</body>
</html>

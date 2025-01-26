
<html>
<head>
    <title>iOS IPA Signer</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background-color: #1a1a1a;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .blackbox {
            width: 450px;
            background-color: #000000;
            margin: 20px;
            padding: 30px;
            border-radius: 15px;
            color: white;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
        }

        .title {
            text-align: center;
            margin-bottom: 30px;
            font-size: 24px;
            color: #007AFF;
        }

        .upload-section {
            margin: 20px 0;
        }

        .upload-section label {
            display: block;
            margin-bottom: 10px;
            color: #ffffff;
            font-size: 14px;
            font-weight: 500;
        }

        .upload-container {
            position: relative;
            width: 100%;
            height: 60px;
            border: 2px dashed #333;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #111;
            transition: all 0.3s ease;
        }

        .upload-container:hover {
            border-color: #007AFF;
            background-color: #161616;
        }

        .upload-container input[type="file"] {
            position: absolute;
            width: 100%;
            height: 100%;
            opacity: 0;
            cursor: pointer;
        }

        .upload-label {
            color: #666;
            font-size: 14px;
            pointer-events: none;
        }

        .file-selected {
            color: #007AFF;
        }

        #p12Password {
            width: 100%;
            padding: 12px;
            margin: 8px 0;
            border-radius: 8px;
            border: 1px solid #333;
            background-color: #111;
            color: white;
            font-size: 14px;
            transition: all 0.3s ease;
        }

        #p12Password:focus {
            border-color: #007AFF;
            outline: none;
            box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.2);
        }

        #signButton {
            width: 100%;
            padding: 15px;
            background-color: #007AFF;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            margin-top: 20px;
            transition: all 0.3s ease;
        }

        #signButton:hover:not(:disabled) {
            background-color: #0056b3;
            transform: translateY(-1px);
        }

        #signButton:disabled {
            background-color: #333;
            cursor: not-allowed;
            opacity: 0.7;
        }

        .status {
            margin-top: 20px;
            padding: 10px;
            border-radius: 8px;
            text-align: center;
            font-size: 14px;
        }

        .status.success {
            background-color: rgba(39, 174, 96, 0.2);
            color: #2ecc71;
        }

        .status.error {
            background-color: rgba(231, 76, 60, 0.2);
            color: #e74c3c;
        }

        #installLink {
            margin-top: 15px;
            padding: 15px;
            background-color: #111;
            border: 1px solid #333;
            border-radius: 8px;
            color: #007AFF;
            word-break: break-all;
            display: none;
            font-family: monospace;
            font-size: 12px;
        }

        .copy-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #007AFF;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            display: none;
            animation: fadeInOut 2s ease-in-out;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .file-info {
            margin-top: 5px;
            font-size: 12px;
            color: #666;
        }

        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-20px); }
            15% { opacity: 1; transform: translateY(0); }
            85% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-20px); }
        }

        .progress-bar {
            width: 100%;
            height: 4px;
            background-color: #333;
            border-radius: 2px;
            margin-top: 20px;
            overflow: hidden;
            display: none;
        }

        .progress-bar-fill {
            height: 100%;
            background-color: #007AFF;
            width: 0%;
            transition: width 0.3s ease;
        }
    </style>
</head>
<body>
    <div class="blackbox">
        <h1 class="title">iOS IPA Signer</h1>

        <div class="upload-section">
            <label for="ipa">IPA File</label>
            <div class="upload-container">
                <input type="file" id="ipa" accept=".ipa" />
                <span class="upload-label">Drop IPA file or click to upload</span>
            </div>
            <div class="file-info" id="ipaInfo"></div>
        </div>

        <div class="upload-section">
            <label for="p12">P12 Certificate</label>
            <div class="upload-container">
                <input type="file" id="p12" accept=".p12" />
                <span class="upload-label">Drop P12 file or click to upload</span>
            </div>
            <div class="file-info" id="p12Info"></div>
        </div>

        <div class="upload-section">
            <label for="provision">Mobile Provision</label>
            <div class="upload-container">
                <input type="file" id="provision" accept=".mobileprovision" />
                <span class="upload-label">Drop provisioning profile or click to upload</span>
            </div>
            <div class="file-info" id="provisionInfo"></div>
        </div>

        <div class="upload-section">
            <label for="p12Password">P12 Certificate Password</label>
            <input type="password" id="p12Password" placeholder="Enter your P12 password" />
        </div>

        <button id="signButton" disabled>Sign IPA</button>
        
        <div class="progress-bar" id="progressBar">
            <div class="progress-bar-fill" id="progressBarFill"></div>
        </div>

        <div id="status" class="status"></div>
        <div id="installLink"></div>
    </div>

    <div id="copyNotification" class="copy-notification">
        Install link copied to clipboard!
    </div>

    <script>
        let files = {
            ipa: null,
            p12: null,
            provision: null
        };

        function updateFileInfo(fileType, file) {
            const infoDiv = document.getElementById(`${fileType}Info`);
            if (file) {
                const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
                infoDiv.textContent = `${file.name} (${sizeMB} MB)`;
                infoDiv.style.color = '#007AFF';
            } else {
                infoDiv.textContent = '';
            }
        }

        function updateUploadLabel(input, defaultText) {
            const container = input.parentElement;
            const label = container.querySelector('.upload-label');
            
            if (input.files && input.files[0]) {
                label.textContent = input.files[0].name;
                label.classList.add('file-selected');
            } else {
                label.textContent = defaultText;
                label.classList.remove('file-selected');
            }
        }

        function updateSignButton() {
            const password = document.getElementById('p12Password').value;
            const signButton = document.getElementById('signButton');
            signButton.disabled = !(files.ipa && files.p12 && files.provision && password);
        }

        function showCopyNotification() {
            const notification = document.getElementById('copyNotification');
            notification.style.display = 'block';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 2000);
        }

        async function copyToClipboard(text) {
            try {
                await navigator.clipboard.writeText(text);
                showCopyNotification();
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        }

        function updateProgress(percent) {
            const progressBar = document.getElementById('progressBar');
            const progressBarFill = document.getElementById('progressBarFill');
            progressBar.style.display = 'block';
            progressBarFill.style.width = `${percent}%`;
        }

        ['ipa', 'p12', 'provision'].forEach(fileType => {
            const input = document.getElementById(fileType);
            const defaultText = input.parentElement.querySelector('.upload-label').textContent;
            
            input.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    files[fileType] = file;
                    updateFileInfo(fileType, file);
                    updateUploadLabel(this, defaultText);
                } else {
                    files[fileType] = null;
                    updateFileInfo(fileType, null);
                    updateUploadLabel(this, defaultText);
                }
                updateSignButton();
            });

            // Drag and drop handling
            const container = input.parentElement;
            
            container.addEventListener('dragover', (e) => {
                e.preventDefault();
                container.style.borderColor = '#007AFF';
                container.style.backgroundColor = '#161616';
            });

            container.addEventListener('dragleave', (e) => {
                e.preventDefault();
                container.style.borderColor = '#333';
                container.style.backgroundColor = '#111';
            });

            container.addEventListener('drop', (e) => {
                e.preventDefault();
                container.style.borderColor = '#333';
                container.style.backgroundColor = '#111';
                
                const file = e.dataTransfer.files[0];
                if (file) {
                    const input = container.querySelector('input[type="file"]');
                    input.files = e.dataTransfer.files;
                    files[fileType] = file;
                    updateFileInfo(fileType, file);
                    updateUploadLabel(input, defaultText);
                    updateSignButton();
                }
            });
        });

        document.getElementById('p12Password').addEventListener('input', updateSignButton);

        document.getElementById('signButton').addEventListener('click', async function() {
            const statusDiv = document.getElementById('status');
            const installLinkDiv = document.getElementById('installLink');
            const progressBar = document.getElementById('progressBar');
            
            statusDiv.textContent = 'Signing IPA...';
            statusDiv.className = 'status';
            installLinkDiv.style.display = 'none';
            progressBar.style.display = 'block';
            
            try {
                const formData = new FormData();
                formData.append('ipa', files.ipa);
                formData.append('p12', files.p12);
                formData.append('provision', files.provision);
                formData.append('p12Password', document.getElementById('p12Password').value);

                updateProgress(0);
                
                const response = await fetch('/api/sign-ipa', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                
                if (result.success) {
                    updateProgress(100);
                    statusDiv.textContent = 'IPA signed successfully!';
                    statusDiv.classList.add('success');
                    
                    installLinkDiv.textContent = result.installUrl;
                    installLinkDiv.style.display = 'block';
                    await copyToClipboard(result.installUrl);
                } else {
                    throw new Error(result.error || 'Signing failed');
                }
                
            } catch (error) {
                updateProgress(0);
                statusDiv.textContent = 'Error signing IPA: ' + error.message;
                statusDiv.classList.add('error');
            }
        });
    </script>
</body>
</html>

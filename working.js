let lastScannedQRCode = "";

function startVideo() {
    navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "environment"
            }
        })
        .then(function(stream) {
            video.srcObject = stream;
            video.setAttribute("playsinline", true);
            video.play();
            requestAnimationFrame(tick);
        })
        .catch(function(err) {
            console.error("Error accessing the camera: " + err);
            alert("Unable to access the camera. Please try again.");
        });
}

function tick() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvasElement.hidden = false;
        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });

        if (code) {
            const scannedQRCode = code.data;

            if (scannedQRCode !== lastScannedQRCode) {
                output.textContent = `QR Code Data: ${scannedQRCode}`;
                logQRCode(scannedQRCode);
                lastScannedQRCode = scannedQRCode;

                setTimeout(() => {
                    output.textContent = "Scan successful! Ready to scan another QR code.";
                    resetScanner();
                }, 2000);
            }
        }
    }
    requestAnimationFrame(tick);
}

function logQRCode(qrValue) {
    const table = document.getElementById("qrLogTable").getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    const timeCell = newRow.insertCell(0);
    const qrValueCell = newRow.insertCell(1);

    const currentTime = new Date().toLocaleTimeString();

    timeCell.textContent = currentTime;
    qrValueCell.textContent = qrValue;
}

function resetScanner() {
    canvasElement.hidden = true;
    video.srcObject.getTracks().forEach(track => track.stop());
    startVideo();
}

const video = document.getElementById('video');
const canvasElement = document.getElementById('canvas');
const canvas = canvasElement.getContext('2d');
const output = document.getElementById('output');
startVideo();

const SAS_TOKEN = 'sas-token';
const CONTAINER_NAME = 'my-container-name';
const BLOB_URI = 'https://my-storage-name.blob.core.windows.net';

const blobService = AzureStorage.createBlobServiceWithSas(BLOB_URI, SAS_TOKEN);

$('#inputFile').on('change', (event) => {
    blobService.createContainerIfNotExists(CONTAINER_NAME, (error, result) => {
        if (error) {
            console.error('create container error');
            return;
        }

        const file = event.target.files[0];
        const customBlockSize = (file.size > 1024 * 1024 * 32)? (1024 * 1024 * 4) : (1024 * 512);
        blobService.singleBlobPutThresholdInBytes = customBlockSize;

        const options = {
            blockSize: customBlockSize,
            contentSettings: {
                contentDisposition: 'attachment'
            }
        };

        beforeUpload();

        let finishedOrError = false;
        const speedSummary = blobService.createBlockBlobFromBrowserFile(CONTAINER_NAME, file.name, file, options, (error, result, response) => {
            finishedOrError = true;
            if (error) {
                console.error('upload error');
                return;
            }
            console.log('upload successfully');
            afterUpload();
        });

        function refreshProgress() {
            setTimeout(() => {
                if (!finishedOrError) {
                    $('#progress').val(speedSummary.getCompletePercent());
                    refreshProgress();
                }
            }, 200);
        }

        refreshProgress();
    });

});

$('#download').on('click', (event) => {
    const file = $('#inputFile').prop('files').item(0);
    if (file == null) return;
    const downloadUrl = blobService.getUrl(CONTAINER_NAME, file.name, SAS_TOKEN);
    $('#image').attr('src', downloadUrl);
});

function beforeUpload() {
    $('#progress').val(0);
    $('#progress').show();
    $('#download').hide();
}

function afterUpload() {
    $('#progress').hide();
    $('#download').show();
}

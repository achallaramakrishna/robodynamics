<%@ page contentType="text/html;charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>Upload Lab Manual</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
</head>

<body class="container py-4">

<h3 class="mb-4">Upload Lab Manual</h3>

<form method="post"
      action="${pageContext.request.contextPath}/admin/labmanual/upload"
      enctype="multipart/form-data">

    <input type="hidden" name="createdBy" value="1"/>

    <div class="mb-3">
        <label class="form-label">Lab Manual JSON</label>
        <textarea class="form-control"
                  name="labManualJson"
                  rows="15"
                  placeholder="Paste full lab manual JSON here..."
                  required></textarea>
    </div>

    <div class="mb-3">
        <label class="form-label">Upload Images (Step Images)</label>
        <input type="file"
               class="form-control"
               name="files"
               multiple
               accept="image/*"
               onchange="previewImages(event)">
        <div class="form-text">
            Upload files named as clientKey.png (example: step1_img1.png)
        </div>
    </div>

    <div id="preview" class="row mb-4"></div>

    <button class="btn btn-success">Upload Lab Manual</button>

</form>

<script>
function previewImages(event) {
    const preview = document.getElementById('preview');
    preview.innerHTML = "";

    Array.from(event.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const col = document.createElement("div");
            col.className = "col-md-2 mb-2";
            col.innerHTML = `<img src="${e.target.result}" class="img-fluid rounded border shadow-sm"/>`;
            preview.appendChild(col);
        };
        reader.readAsDataURL(file);
    });
}
</script>

</body>
</html>

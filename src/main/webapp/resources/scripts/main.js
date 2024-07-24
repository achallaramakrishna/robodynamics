document.addEventListener('DOMContentLoaded', function() {
    const courseListItems = document.querySelectorAll('#course-list li');

    courseListItems.forEach(item => {
        item.addEventListener('click', () => {
            const type = item.getAttribute('data-type');
            const file = item.getAttribute('data-file');
            const details = item.getAttribute('data-details');
            const qa = item.getAttribute('data-qa');

            if (type === 'video') {
                document.getElementById('course-video').style.display = 'block';
                document.getElementById('course-pdf').style.display = 'none';
                document.getElementById('video-source').src = `${contextPath}/assets/videos/${file}`;
                document.getElementById('course-video').load();
            } else if (type === 'pdf') {
                document.getElementById('course-video').style.display = 'none';
                document.getElementById('course-pdf').style.display = 'block';
                document.getElementById('course-pdf').src = `${contextPath}/assets/pdfs/${file}`;
            }

            document.getElementById('course-details-content').textContent = details;
            document.getElementById('course-qa-content').textContent = qa;
        });
    });
});

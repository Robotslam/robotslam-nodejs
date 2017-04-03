const exportContainer = document.querySelector('.export-container');
if (exportContainer !== null) {
  const progressBar = document.querySelector('.export-container .progress-bar');
  const statusSpan = document.querySelector('.export-container span#status');
  const maxValue = progressBar.getAttribute('data-max');
  document.querySelector('.export-container .btn').removeAttribute('disabled'); // fix annoying firefox behaviour

  document.querySelector('.export-container .btn').onclick = function () {
    let button = this;
    let eventSource = new EventSource('export_do');

    button.removeAttribute('disabled');
    button.innerHTML = 'Connecting...';

    eventSource.onerror = function () {
      button.removeAttribute('disabled');
      exportContainer.className = 'export-container session-error';
      statusSpan.innerHTML = 'Export failed.';
      button.innerHTML = 'Start';
      eventSource.close();
    }

    eventSource.onopen = function(e) {
      button.innerHTML = 'Exporting...';
    }

    // session_starting -> sessions_started -> *progress* -> session_closing -> session_closed
    /*eventSource.onmessage = function(e) {
    }*/

    eventSource.addEventListener('session_starting', function(e) {
      statusSpan.innerHTML = 'Starting session...';
      exportContainer.className = 'export-container session-starting';
    }, false);

    eventSource.addEventListener('session_started', function(e) {
      statusSpan.innerHTML = 'Session started. Beginning transfer...';
      exportContainer.className = 'export-container session-started';
    }, false);

    eventSource.addEventListener('progress', function(e) {
      progressBar.style.width = `${e.data/maxValue * 100}%`;
      progressBar.innerHTML = `${e.data} of ${maxValue}`;
      statusSpan.innerHTML = 'Transfer in progress...';
    }, false);

    eventSource.addEventListener('session_closing', function(e) {
      statusSpan.innerHTML = 'Transfer complete. Closing session...';
      exportContainer.className = 'export-container session-closing';
    }, false);

    eventSource.addEventListener('session_closed', function(e) {
      button.removeAttribute('disabled');
      statusSpan.innerHTML = 'Session closed. Export complete.';
      exportContainer.className = 'export-container session-closed';
      button.innerHTML = 'Start';
      eventSource.close();
    }, false);
  };
}

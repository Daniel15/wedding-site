(function() {
  function serializeForm(formEl) {
    let data = [];
    for (let i = 0; i < formEl.elements.length; i++) {
      const serialized = serializeElement(formEl.elements[i]);
      if (serialized) {
        data.push(serialized);
      }
    }
    return data.join('&');
  }

  function serializeElement(el) {
    if (!el.name) {
      return null;
    }
    if (
      (el.type === 'checkbox' || el.type === 'radio') &&
      !el.checked
    ) {
      return null;
    }

    return encodeURIComponent(el.name) + '=' + encodeURIComponent(el.value);
  }

  window.serializeForm = serializeForm;
}());

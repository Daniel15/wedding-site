(function() {
  function initRSVP() {
    const countEl = document.getElementById('count');
    const guestsContainerEl = document.getElementById('rsvp-guests');
    const formEl = document.getElementById('rsvp-form');
    const outputEl = document.getElementById('rsvp-output');
    countEl.addEventListener('change', updateCount, false);
    formEl.addEventListener('submit', submitForm, false);
    updateCount();

    function updateCount() {
      const newCount = countEl.value;
      const oldCount = guestsContainerEl.querySelectorAll('.rsvp-guest').length;
      if (newCount > oldCount) {
        // Adding guests
        for (let i = oldCount; i < newCount; i++) {
          addGuest(i);
        }
      } else if (newCount < oldCount) {
        // Removing guests
        for (let i = oldCount - 1; i >= newCount; i--) {
          const oldGuest = document.getElementById(`rsvp_guest_${i}`);
          guestsContainerEl.removeChild(oldGuest);
        }
      }
    }

    function addGuest(index) {
      const guestEl = document.createElement('li');
      guestEl.id = `rsvp_guest_${index}`;
      guestEl.className = 'rsvp-guest';
      guestEl.innerHTML = `
        <h4>Guest ${index + 1}</h4>
        <label for="name_${index}">Name</label>
        <input type="text" id="name_${index}" name="guests[${index}][name]" />

        <ul class="radio-list-h">
          <li>
            <label>
              <input
                checked="checked"
                type="radio"
                name="guests[${index}][can_attend]"
                value="Yes"
                id="can_attend_${index}_yes"
              />
              <span class="label-body">Able to attend</span>
            </label>
          </li>
          <li>
            <label>
              <input
                type="radio"
                name="guests[${index}][can_attend]"
                value="No"
                id="can_attend_${index}_no"
              />
              <span class="label-body">Can't make it</span>
            </label>
          </li>
        </ul>

        <label for="dietary_${index}">Dietary requirements or allergies (if any)</label>
        <input type="text" name="guests[${index}][dietary]" id="dietary_${index}" />
      `;

      guestsContainerEl.appendChild(guestEl);
    }

    function submitForm(evt) {
      document.body.classList.add('loading');
      if (!window.XMLHttpRequest) {
        return;
      }

      const url = window.location.hostname === 'localhost'
        ? 'http://localdev.alisonanddaniel.wedding/rsvp.php'
        : '/rsvp.php';
      const xhr = new XMLHttpRequest();
      xhr.open('post', url, true);
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.send(serializeForm(formEl));
      xhr.onerror = () => {
        outputEl.classList.add('error');
        const email = unescape('%72%73%76%70%40%61%6c%69%73%6f%6e%61%6e%64%64%61%6e%2e%63%6f%6d');
        outputEl.innerHTML = `
          Sorry, an error occurred 😢. Please email
          <a href="mailto:${email}">${email}</a>.
        `;
        document.body.classList.remove('loading');
      }
      xhr.onload = () => {
        document.body.classList.remove('loading');

        let isError;
        let response;
        try {
          const rawResponse = JSON.parse(xhr.responseText);
          isError = !rawResponse.success;
          response = rawResponse.response;
        } catch (ex) {
          isError = true;
          response = 'Invalid response: ' + ex.message;
        }

        if (isError) {
          outputEl.classList.add('error');
        } else {
          outputEl.classList.remove('error');
          formEl.classList.add('submitted');
        }
        outputEl.innerHTML = response;
      };

      evt.preventDefault();
    }
  }

  initRSVP();
}());

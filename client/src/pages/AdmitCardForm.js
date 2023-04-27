import "./index.css";

function AdmitCardForm() {
  return (
    <div>
      <div class="container">
        <div class="card">
          <div class="card-image">
            <h2 class="card-heading">
              Get started
              <small>Let us create your account</small>
            </h2>
          </div>
          <form
            class="card-form"
            method="post"
            action="https://admitcard.onrender.com:7500/api/contact"
          >
            <div class="input">
              <input type="text" class="input-field" name="name" required />
              <label class="input-label">Full name</label>
            </div>
            <div class="input">
              <input
                type="text"
                class="input-field"
                name="phoneNumber"
                required
              />
              <label class="input-label">Phone</label>
            </div>
            <div class="input">
              <input type="text" class="input-field" name="school" />
              <label class="input-label">School</label>
            </div>
            <div class="input">
              <input
                type="number"
                class="input-field"
                name="clas"
                maxLength="3"
              />
              <label class="input-label">Class</label>
            </div>
            <div class="input">
              <input
                type="number"
                class="input-field"
                name="roll_number"
                maxLength="3"
              />
              <label class="input-label">Roll Number</label>
            </div>
            <div class="input">
              <input type="text" class="input-field" name="address" />
              <label class="input-label">Address</label>
            </div>

            <div class="action">
              <button class="action-button" type="submit">
                Generate
              </button>
            </div>
          </form>
          <div class="card-info"></div>
        </div>
      </div>
    </div>
  );
}

export default AdmitCardForm;

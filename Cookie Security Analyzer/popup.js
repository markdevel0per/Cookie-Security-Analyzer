let currentLanguage = 'en';
let currentUrl = '';
let paragraph = '';

// Function to update UI based on selected language
function updateUI(language) {
  chrome.storage.local.get(['url'], function(result) {
    const url = result.url;
    if (url) {
      currentUrl = url;
      currentUrl = currentUrl.replace(/^https:\/\//, "");
      currentUrl = currentUrl.replace(/\/$/, "");
    }
  });


  chrome.storage.local.get(['cookies'], function(result) {
    const cookies = result.cookies;
    if (cookies && cookies.length > 0) {
      displayCookies(cookies, language);
    } else {
      noCookies(language);
    }
  });

  // Update the text of the toggle button based on the selected language
  const toggleLanguageButton = document.getElementById('toggleLanguage');
  toggleLanguageButton.textContent = language === 'ru' ? 'RU' : 'EN';
}


document.getElementById('toggleLanguage').addEventListener('click', function() {
  currentLanguage = currentLanguage === 'en' ? 'ru' : 'en';
  updateUI(currentLanguage);
});

// Function to display cookies based on selected language
function displayCookies(cookies, language) {
  const localizationFile = language === 'ru' ? 'messages_ru.json' : 'messages_en.json';
  fetch(localizationFile)
    .then(response => response.json())
    .then(localizedStrings => {
      const urlchik = document.getElementById('urlchik');
      urlchik.textContent = "Website: " + currentUrl;

      const beginText = localizedStrings['begin'];
      const cookiesOnPageText = localizedStrings['cookies_on_page'];

      const counterOfCookies = document.getElementById('begin');
      counterOfCookies.textContent = beginText + cookies.length + cookiesOnPageText;
  
      let secureCookieCount = 0;
      let httpOnlyCookieCount = 0;
      let sameSiteCookieCount = 0;
      let propercolor = "black";

      cookies.forEach(function(cookie) {
        if (cookie.secure) {
          secureCookieCount++;
        }
        if (cookie.httpOnly) {
          httpOnlyCookieCount++;
        }
        if (cookie.sameSite == "lax" || cookie.sameSite == "strict") {
          sameSiteCookieCount++;
        }
      });

      let securityLevel = ((httpOnlyCookieCount + secureCookieCount + sameSiteCookieCount) /
        cookies.length * 10 / 3).toFixed(1);

      if (securityLevel <= 1)
      {propercolor = "red";
      paragraph = '0-1';}
      else if (securityLevel <= 3)
      {  propercolor = "orange";
      paragraph = '1-3';}
      else if (securityLevel <= 5)
       { propercolor = "aqua";
      paragraph = '3-5';}
      else if (securityLevel <= 7)
        {propercolor = "green";
      paragraph = '5-7';}
      else
        {propercolor = "magenta";
        paragraph = '7-10';}

      const securityleveloutput = document.getElementById('output');
      securityleveloutput.textContent = securityLevel;
      securityleveloutput.style.color = propercolor;

      const warnText = localizedStrings[paragraph];
      const warn = document.getElementById("warn");
      warn.textContent = warnText;

    });
}

// Function to handle case when no cookies are found based on selected language
function noCookies(language) {
  const localizationFile = language === 'ru' ? 'messages_ru.json' : 'messages_en.json';

  fetch(localizationFile)
    .then(response => response.json())
    .then(localizedStrings => {
      const noCookiesMessage = localizedStrings['no_cookies_message'];

      const cookieList = document.getElementById('cookie-list');
      cookieList.innerHTML = '';
      const message = document.createElement('p');
      message.textContent = noCookiesMessage;
      cookieList.appendChild(message);
    });
}

// Initial UI update
updateUI(currentLanguage);

// Advanced mode switch change event listener
const advancedModeSwitch = document.querySelector('.switch input');
const advancedModeText = document.getElementById('advanced-mode-text');
const cookiesContainer = document.getElementById('cookies-container');

advancedModeSwitch.addEventListener('change', function() {
  if (this.checked) {
    advancedModeText.classList.remove('hidden');
    cookiesContainer.classList.remove('hidden');
    displayAllCookies();
  } else {
    advancedModeText.classList.add('hidden');
    cookiesContainer.classList.add('hidden');
  }
});

// Function to display all cookies when advanced mode is enabled
function displayAllCookies() {
  chrome.storage.local.get(['cookies'], function(result) {
    const cookies = result.cookies;
    const cookiesTable = document.getElementById('cookies-table');
    cookiesTable.innerHTML = '';


    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>Cookie Name</th><th>Cookie Secure</th><th>Cookie HttpOnly</th><th>Cookie SameSite</th>';
    cookiesTable.appendChild(headerRow);


    cookies.forEach(function(cookie) {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${cookie.name}</td><td>${cookie.secure}</td><td>${cookie.httpOnly}</td><td>${cookie.sameSite}</td>`;
      cookiesTable.appendChild(row);
    });
  });
}

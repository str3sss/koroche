import { useCallback, useState } from "react";
import { nanoid } from "nanoid";
import ReactDropdown from "react-dropdown";

import { createShortUrl, updateShortUrl } from "./api/request";
import { DROPDOWN_OPTIONS, SHORT_URL_START } from "./constants";
import { isValidUrl } from "./utils/validator";

import "./App.css";

function App() {
  const [link, setLink] = useState(""); // первая ссыока
  const [shortLink, setShortLink] = useState(null); // короткая ссылка
  const [error, setError] = useState(true); // если неправильная ссылка
  const [сurrentDropdownOption, setCurrentDropdownOption] = useState({ value: 0, label: "поменять время" }); // Для работы со временем

  const [uuid, setUUid] = useState(null);

  // добавляем uid в хранилище
  if (!localStorage.getItem("user_uid")) {
    localStorage.setItem("user_uid", nanoid());
  }

  const onChangeDropdown = useCallback((option) => {
    setCurrentDropdownOption(option);
  }, []);

  const inputHandler = (value) => {
    setLink(value);
    setError(!isValidUrl(value));
  };

  async function createShortLinkHandler(e) {
    e.preventDefault();
    const { uid, alias } = await createShortUrl(link, сurrentDropdownOption?.value);
    setUUid(uid);
    setShortLink(alias);
    console.log(shortLink);
  }

  console.log("id", uuid);

  async function updateShortLinkHandler(e) {
    e.preventDefault();
    console.log(uuid, shortLink);
    const newLink = await updateShortUrl(uuid, shortLink);
    setShortLink(newLink);
  }

  return (
    <>
      <header className="header">
        <h1><a href="/">Koroche</a></h1>
      </header>
      <main>
        <form>
          {shortLink !== null ? (
            <>
              <label>Edit URL:</label>
              <div className="container">
                {SHORT_URL_START}
                <input type="text" required value={shortLink} onChange={(e) => setShortLink(e.target.value)} />
              </div>
              <button type="submit" onClick={(e) => updateShortLinkHandler(e)} disabled={!shortLink}>
                Обновить алиас
              </button>
            </>
          ) : (
            <>
              <label htmlFor="url">Enter URL:</label>
              <div className="container">
                <input type="url" name="url" required value={link} onChange={(e) => inputHandler(e.target.value)} />
                <ReactDropdown
                  className="dropdown"
                  controlClassName="dropdown_control"
                  menuClassName="dropdown_menu"
                  onChange={onChangeDropdown}
                  placeholderClassName="dropdown_placeholder"
                  required
                  options={DROPDOWN_OPTIONS}
                  placeholder={сurrentDropdownOption?.label || "select datetime"}
                />
              </div>
              {error && <span style={{ color: "red" }}>incorrect url</span>}
              <button type="submit" onClick={(e) => createShortLinkHandler(e)} disabled={error}>
                Сделать короче
              </button>
            </>
          )}
        </form>
      </main>
    </>
  );
}

export default App;

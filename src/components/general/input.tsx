import { useEffect, useState } from "react";
import "../../assets/styles/inputStyle.scss";

const Input = (props: any) => {
  const { type, label, wordCount, placeholder, title, setTitle, setFocus, isNumber, isUrl, step, maxnum, minnum, width } = props;
  const [words, setWords] = useState<Number>(0);

  const isCharacterAndNumber = (url: any) => {
    for (let i = 0; i < url.length; i++)
      if (!((url[i] >= '0' && url[i] <= '9') ||
        (url[i] >= 'a' && url[i] <= 'z') ||
        (url[i] >= 'A' && url[i] <= 'Z') ||
        url[i] === '/' || url[i] === '.'))
        return false;
    return true;
  }

  const onChange = (e: any) => {
    if (isUrl) {
      if (isCharacterAndNumber(e.target.value)) {
        setWords(e.target.value.length);
        setTitle(e.target.value);
      }
    }
    else {
      setWords(e.target.value.length);
      let value = e.target.value;
      if (isNumber) {
        let first: number = Number(value);
        let second: any = Number(value).toFixed(1);
        let diff = Math.abs(first - second);
        if (diff < 0.1 && diff > 0.0) value = Number(value).toFixed(1);
        if (minnum !== undefined && maxnum !== undefined) {
          value = parseInt(value);
          if (value < minnum) value = minnum;
          if (value > maxnum) value = maxnum;
        }
      }
      setTitle(value);
    }
  };

  useEffect(() => {
    if (title)
      setWords(title.length);
  }, [title]);

  return (
    <div className="input-wrapper" style={{ width: width ? `${width}px` : '320px' }}>
      <div className="input">
        <div className="label">{label}</div>
        <div
          className="input-field"
          style={{ height: `${type === "input" ? "48px" : "100px"}` }}
        >
          {
            type === "textarea" ?
              <textarea
                placeholder={placeholder}
                onChange={onChange}
                value={title}
                maxLength={wordCount}
                onFocus={setFocus}
              /> :
              <input
                style={{ width: width ? `${width - 32}px` : '288px' }}
                type={isNumber ? "number" : "text"}
                placeholder={placeholder}
                maxLength={wordCount}
                onChange={onChange}
                step={isNumber ? step ? step : 0.1 : ""}
                value={title}
                onFocus={setFocus}
              />
          }
        </div>
        {wordCount !== undefined ?
          <div className="word-count">
            ({words}/{wordCount} characters)
          </div>
          :
          <div></div>
        }
      </div>
    </div>
  );
};

export default Input;

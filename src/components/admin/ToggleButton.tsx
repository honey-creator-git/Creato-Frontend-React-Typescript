import '../../assets/styles/toggleButtonStyle.css';

const ToggleButton = (props: any) => {
    const { toggle, setToggle } = props;

    const triggerToggle = () => {
        setToggle( !toggle )
    }

    return(
        <div onClick={triggerToggle} className={`wrg-toggle ${toggle ? 'wrg-toggle--checked' : ''}`}>
            <div className="wrg-toggle-container">
                <div className="wrg-toggle-check"></div>
                <div className="wrg-toggle-uncheck"></div>
            </div>
            <div className="wrg-toggle-circle"></div>
            <input className="wrg-toggle-input" type="checkbox" aria-label="Toggle Button" />
        </div>
    )
}

export default ToggleButton;
import { useEffect } from "react";
import "../../assets/styles/selectStyle.scss";

const Select = (props: any) => {
    const { label, users, setOption, option } = props;

    useEffect(() => {
        if (users.length) setOption(users[0]._id);
    }, [users]);

    useEffect(() => {
        if(option === "" && users.length) setOption(users[0]._id);
    }, [option]);

    return (
        <div className="select-option-wrapper">
            <div className="input">
                <span className="label">{label}:</span>
                <div className="input-field">
                    <select onChange={(e) => { setOption(e.target.value); }} value={option}>
                        {users.map((user: any, index: any) => (
                            <option key={index} value={user._id}>{user.name}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Select;

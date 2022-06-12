import Button from "./button";
import { PlusIcon } from "../../constants/awesomeIcons";
import { RemoveIcon } from "../../assets/svg";
import "../../assets/styles/inputDonutsStyle.scss";

const InputDonuts = (props: any) => {
    const { setAmount, amount } = props;

    const isNumber = (str: any) => {
        for (let i = 0; i < str.length; i++)
            if (!(str[i] >= '0' && str[i] <= '9'))
                return false;
        return true;
    }

    const onChange = (e: any) => {
        if (isNumber(e.target.value)) setAmount(e.target.value);
    };

    return (
        <div className="input-donuts-wrapper">
            <div>
                <Button
                    fillStyle="fill"
                    color="primary"
                    icon={[
                        <RemoveIcon color="white" />,
                        <RemoveIcon color="white" />,
                        <RemoveIcon color="white" />
                    ]}
                    handleSubmit={() => {
                        let cnt = Number(amount);
                        if (cnt > 0) setAmount(cnt - 1);
                    }}
                />
            </div>
            <div className="input">
                <div className="input-field" >
                    <input
                        type="text"
                        placeholder={"Amount"}
                        onChange={onChange}
                        value={amount}
                        onFocus={() => { }}
                    />
                </div>
            </div>
            <div>
                <Button
                    fillStyle="fill"
                    color="primary"
                    icon={[
                        <PlusIcon color="white" />,
                        <PlusIcon color="white" />,
                        <PlusIcon color="white" />
                    ]}
                    handleSubmit={() => {
                        let cnt = Number(amount);
                        setAmount(cnt + 1);
                    }}
                />
            </div>
        </div>
    );
};

export default InputDonuts;

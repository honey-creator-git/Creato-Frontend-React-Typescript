import '../../assets/styles/gifStyle.scss';

const Gif = (props: any) => {
    return (
        <div className="gif-wrapper">
            <div className="gif-main">
                <img src={props.gif} />
            </div>
        </div>
    )
}

export default Gif;
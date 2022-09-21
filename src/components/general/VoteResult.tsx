import DareOption from "./dareOption"
import "../../assets/styles/VoteResultStyle.scss"

const VoteResult = (props: any) => {
  const { options } = props

  return (
    <div className="vote-result-wrapper">
      <div className="header-title">
        <span>Vote Result</span>
      </div>
      <div className="vote-options scroll-bar">
        {options.map((option: any, index: any) => (
          <div className="option">
            <div className="rank" style={{ backgroundColor: index === 0 ? '#EA8426' : index === 1 ? '#F7BA1E' : index === 2 ? '#14C9C9' : '#D6D5CC' }}>
              <span>#{index + 1}</span>
            </div>
            <div className="card">
              <DareOption
                dareTitle={option.option.title}
                voters={option.option.voters}
                donuts={option.option.donuts}
                username={option.option.writer.name}
                disabled={false}
                handleSubmit={() => { }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default VoteResult
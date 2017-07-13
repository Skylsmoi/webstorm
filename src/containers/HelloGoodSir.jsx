import React from 'react'
import { connect } from 'react-redux'

export class HelloGoodSir extends React.Component {
  render () {
    const { hello } = this.props

    return (
      <div>
        { `${hello.messageDeep.begin} ${hello.messageDeep.middle} ${hello.messageDeep.end}` }
      </div>
    )
  }
}

const mapStateToProps = ({ hello }) => ({ hello })
export default connect(mapStateToProps)(HelloGoodSir)

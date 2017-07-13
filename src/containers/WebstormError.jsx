import React from 'react'
import { connect } from 'react-redux'
import HelloGoodSir from './HelloGoodSir.jsx'
import { setHelloData, mapHelloWithApi } from '../action-creator.sync.js'

export class WebstormError extends React.Component {
  handleBtnClick = () => this.props.dispatch(setHelloData({
    unique_id: '1',
    message: 'How imaginative are you ?',
    messageDeep: {
      begin: 'Not',
      middle: 'much',
      end: ', :(.'
    }
  }))

  handleOtherBtnClick = () => this.props.dispatch(mapHelloWithApi({
    unique_id: '3',
    msg: 'Another deep thought ?',
    deep: {
      beg: 'I wonder',
      mid: 'why',
      end: '> insert interesting question here <'
    }
  }))

  render () {
    const { hello } = this.props

    return (
      <div>
        <input type='button' onClick={this.handleBtnClick} value='click me' />
        <input type='button' onClick={this.handleOtherBtnClick} value='dont click me' />
        <div>
          { hello.message }
          <HelloGoodSir />
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ hello }) => ({ hello })
export default connect(mapStateToProps)(WebstormError)

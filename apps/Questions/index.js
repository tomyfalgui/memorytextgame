import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
  Alert
} from 'react-native'
import { connect } from 'react-redux'
import { changeToHome, answer, next, restart } from '../../actions'
import styles from './styles'
import Question from '../components/Question'
import Headline from '../components/Headline'
import _ from 'lodash'

class Questions extends Component {
  state = {
    order: null,
    questions: null,
    score: null,
    lose: null
  }

  componentDidMount() {
    this.setState({
      questions: _.shuffle(this.props.questions.tree),
      order: this.props.order,
      score: this.props.questions.score,
      lose: this.props.questions.lose
    })
  }

  _onPress = (id, answer) => () => {
    this.props.next()
    this.props.answer(id, answer)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.order !== this.props.order) {
      this.setState({
        order: nextProps.order,
        lose: nextProps.questions.lose,
        score: nextProps.questions.score
      })
    }
  }
  restartEverything = () => {
    this.props.changeToHome()
    this.props.restart()
  }

  render() {
    const { questions, order, score, lose } = this.state

    return (
      <View style={styles.layout}>
        <TouchableOpacity
          onPress={this.restartEverything}
          style={{ alignSelf: 'flex-end', marginRight: 25, marginTop: 20 }}
        >
          <Text
            style={{
              color: 'rgba(255,255,255,0.8)',
              textShadowColor: 'rgba(0,0,0,0.4)',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 1
            }}
          >
            Exit
          </Text>
        </TouchableOpacity>
        {questions && (
          <Headline text={_.sample(_.shuffle(questions[order].question))} />
        )}

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}
        >
          {questions &&
            _.shuffle(questions[order].choices).map(el => {
              return (
                <Question
                  text={el}
                  key={el}
                  _onPress={this._onPress(questions[order].id, el)}
                />
              )
            })}
        </View>
        <Text>{score}</Text>
        <Text>
          {lose &&
            (() => {
              Alert.alert('YOU LOSE', `Survived after ${score} rounds`)
            })()}
        </Text>
      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    questions: state.main,
    order: state.order
  }
}

export default connect(mapStateToProps, {
  changeToHome,
  answer,
  next,
  restart
})(Questions)
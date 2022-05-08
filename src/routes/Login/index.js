import React, { useState } from 'react'
import { cx } from '../../styles'
import styles from './Login.module.scss'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

const BASIC_DATA = {
  id: '',
  userNickName: '',
  isLogined: false,
  data: {
    category: [],
    todoList: [],
  },
}

function Login({currentUserName, setCurrentUserName}) {
  const [userName, setUserName] = useState(currentUserName)
  const [isAvailableName, setIsAvailableName] = useState(false)

  const navigate = useNavigate()

  const checkUserNameValidation = (nickName) => {
    const regExp = /^[가-힣a-z0-9_-]{1,15}$/
    return regExp.test(nickName)
  }

  const onChangeInputValue = (e) => {
    setUserName(e.currentTarget.value)
    setIsAvailableName(checkUserNameValidation(e.currentTarget.value))
  }

  const onClickLoginBtn = () => {
    const item = JSON.parse(localStorage.getItem('todo'))
    const newUser = {
      ...BASIC_DATA,
      userNickName: userName,
      id: `${new Date().getMilliseconds()}${userName}`,
      isLogined: true,
    }
    try {
      if (item === null) {
        localStorage.setItem('todo', JSON.stringify([newUser]))
        navigate('/', { state: { userId: `${new Date().getMilliseconds()}${userName}`, isNewUser: true } })
      } else if (item.map((el) => el.userNickName).includes(userName)) {
        const loginUser = item.find((el) => el.userNickName === userName)
        navigate('/', { state: { userId: loginUser.id, isNewUser: false } })
      } else {
        localStorage.setItem('todo', JSON.stringify([...item, newUser]))
        navigate('/', { state: { userId: `${new Date().getMilliseconds()}${userName}`, isNewUser: true } })
      }
      localStorage.setItem('currentUserName', userName)
      setCurrentUserName(userName)
    } catch (e) {
      console.log(e)
    }
  }

  const onPressEnter = (e) => {
    if (isAvailableName) {
      if (e.key === 'Enter') {
        onClickLoginBtn()
      }
    }
  }

  return (
    <div className={styles.loginWrapper}>
      <p className={styles.loginTitle}>닉네임을 입력해주세요</p>
      <input maxLength={15} onKeyPress={onPressEnter} onChange={onChangeInputValue} className={styles.loginInput} />
      <p className={cx(styles.warningMessage, { [styles.displayNone]: isAvailableName })}>
        닉네임 형식에 맞게 입력해주세요.
      </p>
      <button
        disabled={!isAvailableName}
        type='button'
        onClick={onClickLoginBtn}
        className={cx(styles.loginBtn, isAvailableName ? styles.ableBtn : styles.disableBtn)}
      >
        Login
      </button>
    </div>
  )
}

Login.propTypes = {
  currentUserName: PropTypes.string,
  setCurrentUserName: PropTypes.func
}

export default Login

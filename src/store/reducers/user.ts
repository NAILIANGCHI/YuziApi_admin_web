
interface User {
    id:number,
    mobile: number,

}

interface State {
    user: User
}
const UserState: State = {
    user: {
        id: 0,
        mobile: 10086
    }
}

const user = (state:State = UserState) => {

    const newState = JSON.parse(JSON.stringify(state))

    return newState

}

export default user
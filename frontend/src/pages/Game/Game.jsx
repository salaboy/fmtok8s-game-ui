import "./Game.scss";
import React, {useEffect, useState, useContext, useReducer} from "react";
import {motion} from "framer-motion"
import {useLocomotiveScroll} from 'react-locomotive-scroll';
import AppContext from '../../contexts/AppContext';
import cn from 'classnames';
import {CloudEvent, HTTP} from "cloudevents";
import axios from "axios";

import dockerNames from "docker-names"
import {gameStateReducer} from "../../reducers/GameStateReducer";
import GameContext from "../../contexts/GameContext";
import Button from "../../components/Button/Button";
import TextField from "../../components/Form/TextField/TextField";

import Level1 from "../../components/Level1/Level1";
import Level2 from "../../components/Level2/Level2";
import Level3 from "../../components/Level3/Level3";
import Level4 from "../../components/Level4/Level4";

// Short logic description
// 1) Create a game session: call POST /game/ to create a new session
// 2) Add the session to the gameStateReducer, check if there is a session always in state
// 3) If there is a session, check if the current level exist by querying the health endpoints of the function using the gameInfo levelId
// 4) If the level is available enable the start level button
// 5) wait for the state of the level change to completed
// 6) Show move to next level button, move to 3, where first we need to check if the level exists or not


function Game() {
    const {currentSection, setCurrentSection, setUser, user} = useContext(AppContext);

    const {gameState} = useContext(GameContext)
    const [state, dispatch] = useReducer(gameStateReducer, gameState)
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    let [delay, setDelay] = useState(4000);

    const [nickname, setNickname] = useState("")


    function handleDelayChange(e) {
        setDelay(Number(e.target.value));
    }

    //scroll
    const {scroll} = useLocomotiveScroll();
    useEffect(() => {
        setCurrentSection("game");
        if (scroll) {
            scroll.destroy();
            scroll.init();
        }
    }, [scroll]);
    //Handle advanced page transitions
    const pageVariants = {
        visible: {opacity: 1},
        hidden: {opacity: 0},
        exit: {opacity: 0, transition: {duration: .5}}
    }
    const pageAnimationStart = e => {
    };
    const pageAnimationComplete = e => {
    };


    function createMyGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }


    function newGame() {
        if (loading) {
            return;
        }
        setLoading(true);
        if (nickname === "") {
            console.log("nickname cannot be empty")
        }
        if (state.sessionID === "") {
            axios.post('/game/' + nickname).then(res => {
                console.log(res.data)
                dispatch({type: "gameSessionIdCreated", payload: res.data})
                setUser(nickname);
                setLoading(false)
            }).catch(err => {
                console.log(err)
            });
        }

    }


    const startLevel = () => {
        if (loading) {
            return;
        }
        setLoading(true);
        axios.post('/game/' + state.sessionID + '/level-' + state.currentLevelId + '/start').then(res => {
            console.log(res.data)
            dispatch({type: "levelStartedTriggered", payload: res.data})
            setLoading(false)
        }).catch(err => {
            console.log(err)
        });
    }

    const moveToNextLevel = () => {
        console.log("Checking if next level is available: " + state.nextLevelId)
        dispatch({type: "nextLevelTriggered", payload: state.nextLevelId})
    }


    function generatePlayerName() {
        setNickname(dockerNames.getRandomName(true))
    }


    function emitCloudEvent(button) {
        console.log("Button: " + button + " pressed! ")
        const cloudEvent = new CloudEvent({
            id: createMyGuid(),
            type: "GameEvent",
            source: "website",
            subject: "gameevent",
            data: {
                button: String(button),
                timestamp: Date.now().toString(),
                sessionId: state.sessionID
            },
        });
        console.log(" --- Cloud Event Data Sent ---")
        console.log(cloudEvent.data)

        const message = HTTP.binary(cloudEvent);
        //console.log("Sending Post to func!")
        // This needs to send to broker which needs to send to the right function level, based on the level which the user is
        axios.post('/default', message.body, {headers: message.headers}).then(res => {
            console.log("Broker response")
            console.log(res.headers)
            console.log(res.data)

        }).catch(err => {

            console.log(err)
            console.log(err.response.data.message)
            console.log(err.response.data)
        });

    }

    function notNickname() {
        return nickname == "";
    }

    return (
        <motion.div
            exit="exit"
            animate="visible"
            initial="hidden"
            variants={pageVariants}
            onAnimationStart={pageAnimationStart}
            onAnimationComplete={pageAnimationComplete}
        >

            <div className={cn({
                ["page"]: true,
                ["game"]: true
            })}
            >

                <section>

                    <h1>Play with us!</h1>

                    {state.landed && (
                        <div>
                            {!state.sessionID && (
                                <div className="Card">

                                    <TextField inputProps={
                                        {readOnly: true,}
                                    } label={"Enter your nickname:"} value={nickname}></TextField>
                                    <Button clickHandler={generatePlayerName}>Generate Player Name</Button>
                                    <Button clickHandler={newGame}
                                            disabled={loading || notNickname()}>{loading ? 'Loading...' : 'Let\'s Play!'}</Button>
                                </div>
                            )}
                            {state.sessionID && (
                                <div className="Card">
                                    {/*<h4>SessionId: {state.sessionID} </h4>*/}
                                    {!state.currentLevelStarted && (
                                        <>
                                            <h4>Ready to play <strong> {state.nickname}</strong>? </h4>
                                            <br/>
                                        </>
                                    )}


                                    {!state.currentLevelStarted && (
                                        <div>
                                            <Button main clickHandler={startLevel}
                                                    disabled={loading}>{loading ? 'Loading...' : 'Start Level ' + state.currentLevelId}</Button>
                                        </div>
                                    )}
                                    {state.currentLevelStarted && !state.currentLevelCompleted && state.currentLevelId == 1 && (
                                        <>

                                            <Level1 state={state} dispatch={dispatch}/>
                                        </>
                                    )}
                                    {state.currentLevelStarted && !state.currentLevelCompleted && state.currentLevelId == 2 && (
                                        <>

                                            <Level2 state={state} dispatch={dispatch}/>
                                        </>
                                    )}

                                    {state.currentLevelStarted && !state.currentLevelCompleted && state.currentLevelId == 3 && (
                                        <>

                                            <Level3 state={state} dispatch={dispatch}/>
                                        </>
                                    )}

                                    {state.currentLevelStarted && !state.currentLevelCompleted && state.currentLevelId == 4 && (
                                        <>

                                            <Level4 state={state} dispatch={dispatch}/>
                                        </>
                                    )}

                                    {state.currentLevelCompleted && (
                                        <>
                                            Congratulations you completed the level!
                                            <Button main clickHandler={moveToNextLevel}
                                                    disabled={loading}>{loading ? 'Loading...' : 'Next Level'}</Button>
                                        </>
                                    )}


                                </div>
                            )}

                        </div>

                    )}


                </section>
            </div>
        </motion.div>
    )
}

export default Game;

import React from 'react';
import { animated } from 'react-spring';
import { useWiggle } from '../hooks/wiggle';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedRow } from '../components/actions.jsx';

const strings = [
    'Hello React',
    'Salut React',
    'Hola React',
    '안녕 React',
    'Hej React',
];

function randomLanguage() {
    return strings[Math.floor(Math.random() * strings.length)];
}

export default function Home() {
    const [hello, setHello] = React.useState(strings[0]);
    const selectedRow = useSelector((state) => state.selectedRow);
    const dispatch = useDispatch();
    const [style, trigger] = useWiggle({ x: 5, y: 5, scale: 1 });

    const handleChangeHello = () => {
        const newHello = randomLanguage();
        setHello(newHello);
    };

    const handleRowClick = (rowData) => {
        dispatch(setSelectedRow(rowData));
    };

    return (
        <>
            <h1 className="title">{hello}!</h1>
            {selectedRow && (
                <>
                    <p>First Name: {selectedRow.first_name}</p>
                    <p>Last Name: {selectedRow.last_name}</p>
                    <p>Cabbage: {selectedRow.nickname}</p>
                </>
            )}
            <animated.div onMouseEnter={trigger} style={style}>
                <img
                    src="https://cdn.glitch.com/2f80c958-3bc4-4f47-8e97-6a5c8684ac2c%2Fillustration.svg?v=1618196579405"
                    className="illustration"
                    onClick={handleChangeHello}
                    alt="Illustration click to change language"
                />
            </animated.div>
            <div className="navigation">
                <animated.div onMouseEnter={trigger}>
                    <a className="btn--click-me" onClick={handleChangeHello}>
                        Psst, click me
                    </a>
                </animated.div>
            </div>
        </>
    );
}

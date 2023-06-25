import { useSelector } from 'react-redux';

export default function CheckIn() {
    const selectedRow = useSelector(state => state.selectedRow);

    return (
        <>
            <h1 className="title">CheckIn!</h1>
            <div>
                {selectedRow && (
                    <>
                        <p>First Name: {selectedRow.first_name}</p>
                        <p>Last Name: {selectedRow.last_name}</p>
                        <p>Cabbage: {selectedRow.nickname}</p>
                    </>
                )}
            </div>
        </>
    );
}

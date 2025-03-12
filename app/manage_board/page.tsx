import React from 'react';

const Card: React.FC = () => {
    return (
        <div className="packet-container" style={{
            position: 'relative',
            width : "100%",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'

        }}>
            <img src="/packet.png" alt="packett" style={{width : '60%'}}></img>
            <div className="monomakh-regular" style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                height : '40%',
                width: '50%',
                maxWidth: '400px',
                textAlign: 'center',
                backgroundColor: '#d1d5db',
                borderRadius: '8px',

                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',

            }}>
                <p style={{marginBottom : '20px', marginTop : '20px'}}>Название</p>
                <p>Дедлайн выполнения</p>
            </div>
        </div>
    );
};

const NewPage: React.FC = () => {
    return (
        <div className="monomakh-regular" style={{
            position: 'relative',
            backgroundImage: "url('/background-manage.jpg')",
            backgroundSize: 'cover',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <button style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                width: '80px',
                height: '80px',
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '50px',
                cursor: 'pointer'
            }}>
                <img src="/arrow-left.png" alt="arrow-left" style={{ width: '100%', height: '80%' }} />
            </button>

            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                width: '80%',
                height: '80%'
            }}>
                <div style={{
                    backgroundColor: 'rgba(124, 124, 124, 0.5)',
                    width: '30%',
                    height: '100%',
                    borderRadius: '20px',
                    border: '4px solid rgb(212, 212, 212)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingTop: '20px'
                }}>
                    <h2 style={{
                        fontSize : '50px',
                        color: 'white' }}>Открытые</h2>
                    <Card />
                    <Card />
                </div>
                <div style={{
                    backgroundColor: 'rgba(124, 124, 124, 0.5)',
                    width: '30%',
                    height: '100%',
                    borderRadius: '20px',
                    border: '4px solid rgb(212, 212, 212)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingTop: '20px'
                }}>
                    <h2 style={{ fontSize : '50px',
                        color: 'white'
                    }}>Закрытые</h2>
                    <Card />
                    <Card />
                </div>
                <div style={{
                    backgroundColor: 'rgba(124, 124, 124, 0.5)',
                    width: '30%',
                    height: '15%',
                    borderRadius: '20px',
                    border: '4px solid rgb(212, 212, 212)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingTop: '20px'
                }}>
                    <h2 style={{
                        fontSize : '50px',
                        color: 'white' }}>Добавить карточку</h2>

                </div>
            </div>
        </div>
    );
};

export default NewPage;
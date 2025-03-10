import React from 'react';

const Card: React.FC = () => {
    return (
        <div className="monomakh-regular" style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            margin: '10px',
            width: '75%',
            height: '20%'
        }}>
            <h3>Карточка</h3>
            <p>Содержимое карточки</p>
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
            
            <button style={{
                position: 'absolute',
                bottom: '10px',
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
                <img src="/question.png" alt="question" style={{ width: '100%', height: '60%' }} />
            </button>

            <button style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                width: '80px',
                height: '80px',
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '50px',
                cursor: 'pointer'
            }}>
                <img src="/addition.png" alt="addition" style={{ width: '100%', height: '65%' }} />
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
                    <h2 style={{ color: 'white' }}>Заголовок 1</h2>
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
                    <h2 style={{ color: 'white' }}>Заголовок 2</h2>
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
                    <h2 style={{ color: 'white' }}>Заголовок 3</h2>
                    <Card />
                    <Card />
                </div>
            </div>
        </div>
    );
};

export default NewPage;
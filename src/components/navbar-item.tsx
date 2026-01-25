type NavbarItemProps = {
    icon: preact.ComponentChild,
    onclick: () => void,
    selected?: boolean
}

export const NavbarItem = ({ icon, onclick, selected }: NavbarItemProps) => {
    return (
        <div
            onClick={onclick}
            style={{
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                cursor: 'pointer',
            }}>

            <div style={{
                width: '6px',
                height: '22px',
                borderRadius: '0 0.2rem 0.2rem 0',
                backgroundColor: '#F59300',
                opacity: selected ? 1 : 0,
            }} />

            <div>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    display: 'flex',
                    alignSelf: 'center',
                    width: '6px',
                    height: '26px',
                    borderRadius: '0 0.25rem 0.25rem 0',
                    backgroundColor: '#F59300',
                    opacity: selected ? 1 : 0,
                    transition: 'all 0.3s',
                }} />

                <div
                    onClick={onclick}
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '34px',
                        height: '34px',
                        borderRadius: '0.25rem',
                        backdropFilter: 'blur(4px)',
                        backgroundColor: selected ? 'rgba(68, 68, 68, 0.6)' : 'transparent',
                        border: '1px solid',
                        borderColor: selected ? 'rgba(68, 68, 68, 0.6)' : 'transparent',
                        transition: 'all 0.3s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(68, 68, 68, 0.4)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >

                    <div style={{
                        display: 'flex',
                        color: '#F7F7F7',
                        opacity: selected ? 1 : 0.6,
                        paddingTop: "0.2rem",
                        paddingBottom: "0.2rem",
                    }}>{icon}</div>
                </div>
            </div>

        </div >
    )
}
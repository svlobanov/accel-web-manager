import { Dropdown, Button, ButtonGroup, Popover, IconButton, Whisper } from 'rsuite';

import ArrowDownIcon from '@rsuite/icons/ArrowDown';

const SessionsButton = ({ children, loadSessions, duplicateKeys, disabled }) => {

    const renderMenu = ({ onClose, left, top, className }, ref) => {
        const handleSelect = eventKey => {
            loadSessions({ 'key': eventKey })
            onClose();
        };
        return (
            <Popover ref={ref} className={className} style={{ left, top }} full>
                <Dropdown.Menu size='xs' onSelect={handleSelect} >
                    {
                        Object.keys(duplicateKeys).map(key =>
                            <Dropdown.Item key={key} eventKey={key}>{duplicateKeys[key]['name']}</Dropdown.Item>
                        )
                    }
                </Dropdown.Menu>
            </Popover>
        );
    }

    return (
        <ButtonGroup size='xs'>
            <Button onClick={() => { loadSessions() }} disabled={disabled}>{children}</Button>
            <Whisper placement="bottom" trigger="click" speaker={renderMenu}>
                <IconButton disabled={disabled} icon={<ArrowDownIcon />} />
            </Whisper>
        </ButtonGroup>
    )
}

export default SessionsButton;
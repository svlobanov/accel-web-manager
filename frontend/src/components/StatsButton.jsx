import { Dropdown, Button, ButtonGroup, Popover, IconButton, Whisper } from 'rsuite';

import ArrowDownIcon from '@rsuite/icons/ArrowDown';

const StatsButton = ({ children, loadStats, disabled }) => {

    const renderMenu = ({ onClose, left, top, className }, ref) => {
        const handleSelect = mode => {
            loadStats(mode)
            onClose()
        };
        return (
            <Popover ref={ref} className={className} style={{ left, top }} full>
                <Dropdown.Menu size='xs' onSelect={handleSelect} >
                    <Dropdown.Item eventKey='pppoe'>PPPoE Stats</Dropdown.Item>
                </Dropdown.Menu>
            </Popover>
        );
    }

    return (
        <ButtonGroup size='xs'>
            <Button onClick={() => loadStats("general")} disabled={disabled}>{children}</Button>
            <Whisper placement="bottom" trigger="click" speaker={renderMenu}>
                <IconButton disabled={disabled} icon={<ArrowDownIcon />} />
            </Whisper>
        </ButtonGroup>
    )
}

export default StatsButton;
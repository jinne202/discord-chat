import React, { CSSProperties, FC, useCallback } from 'react';

import { CreateMenu, CloseModalButton, MenuModal } from './styles';

interface Props {
    show : boolean;
    onCloseModal : () => void;
    closeButton?: boolean;
    style: CSSProperties;
}

const Menu: FC<Props> = ({ children, style, show, onCloseModal, closeButton }) => {

    const stopPropagation = useCallback((e) => {
        e.stopPropagation();
    }, [])

    if(!show) {
        return null;
    }

    return (
        <CreateMenu onClick={onCloseModal}>
            <MenuModal style={style} onClick={stopPropagation}>
                {children}
            </MenuModal>
        </CreateMenu>
    )
}

export default Menu;
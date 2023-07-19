import { Link } from 'react-router-dom';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import React, { Component, FC, forwardRef, PropsWithChildren, useMemo } from 'react';

interface IProps {
    icon?: Component;
    text: string;
    to: string;
    url: string;
}

const ListItemLink: FC<IProps> = (props: PropsWithChildren<IProps>): JSX.Element => {
    // eslint-disable-next-line react/display-name,react/prop-types
    const CustomLink = useMemo(() => forwardRef((linkProps, ref: any) => <Link ref={ref} to={`${props.url}/${props.to}`} {...linkProps} />), [
        props.to,
        props.url,
    ]);

    return (
        <ListItem button component={CustomLink}>
            {props.icon ? <ListItemIcon>{props.icon}</ListItemIcon> : null}
            <ListItemText primary={props.text} />
        </ListItem>
    );
};
export default ListItemLink;

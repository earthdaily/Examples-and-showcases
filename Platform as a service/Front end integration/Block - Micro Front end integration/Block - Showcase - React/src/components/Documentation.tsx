import Markdown from 'markdown-to-jsx';
import React, { FC } from 'react';

// @ts-ignore
import Docs from '../core/docs/welcome.md';
import { Link, Paper, Typography, withStyles } from '@material-ui/core';
import styled from 'styled-components';

const styles = (theme: any) => ({
    listItem: {
        marginTop: theme.spacing(1),
    },
    blockquote: {
        margin: 0,
        padding: theme.spacing(2, 0, 2, 4),
        borderLeft: `${theme.spacing(1)}px solid ${theme.palette.divider}`,
        color: theme.palette.text.hint,
    },
});

const options = {
    overrides: {
        h1: {
            component: Typography,
            props: {
                gutterBottom: true,
                variant: 'h5',
            },
        },
        h2: { component: Typography, props: { gutterBottom: true, variant: 'h6' } },
        h3: {
            component: Typography,
            props: { gutterBottom: true, variant: 'subtitle1' },
        },
        h4: {
            component: Typography,
            props: { gutterBottom: true, variant: 'caption', paragraph: true },
        },
        p: { component: Typography, props: { paragraph: true } },
        a: { component: Link },
        li: {
            // @ts-ignore
            component: withStyles(styles)(({ classes, ...props }) => (
                <li className={classes.listItem}>
                    <Typography component='span' {...props} />
                </li>
            )),
        },
        code: {
            component: Paper,
            props: { elevation: 0, style: { padding: '4px 8px', background: '#404040', color: '#dedede' } },
        },
        blockquote: {
            // @ts-ignore
            component: withStyles(styles)(({ classes, ...props }) => (
                <blockquote className={classes.blockquote}>
                    <Typography component='span' {...props} />
                </blockquote>
            )),
        },
    },
};

const Documentation: FC = () => (
    <MarkdownContainer>
        <Markdown options={options}>{Docs}</Markdown>
    </MarkdownContainer>
);

const MarkdownContainer = styled.div`
    margin: 0;
`;

export default Documentation;

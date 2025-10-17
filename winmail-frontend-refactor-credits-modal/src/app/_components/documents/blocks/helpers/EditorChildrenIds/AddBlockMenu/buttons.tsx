import React from 'react';

import { TEditorBlock } from '../../../../editor/core';
import {
  MdCrop32,
  MdHorizontalRule,
  MdImage,
  MdOutlineHtml,
  MdOutlineLibraryAdd,
  MdOutlineViewColumn,
  MdSmartButton,
} from 'react-icons/md';
import { RiHeading } from 'react-icons/ri';
import { IoTextOutline } from 'react-icons/io5';
import { FaRegUserCircle } from 'react-icons/fa';

type TButtonProps = {
  segment: string;
  icon: JSX.Element;
  block: () => TEditorBlock;
};

export const BUTTONS: TButtonProps[] = [
  {
    segment: 'Heading',
    icon: <RiHeading />,
    block: () => ({
      type: 'Heading',
      data: {
        props: { text: 'Hello friend' },
        style: {
          padding: { top: 16, bottom: 16, left: 24, right: 24 },
        },
      },
    }),
  },
  {
    segment: 'Text',
    icon: <IoTextOutline />,
    block: () => ({
      type: 'Text',
      data: {
        props: { text: 'My new text block' },
        style: {
          padding: { top: 16, bottom: 16, left: 24, right: 24 },
          fontWeight: 'normal',
        },
      },
    }),
  },

  {
    segment: 'Button',
    icon: <MdSmartButton />,
    block: () => ({
      type: 'Button',
      data: {
        props: {
          text: 'Button',
          url: 'https://www.usewaypoint.com',
        },
        style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
      },
    }),
  },
  {
    segment: 'Image',
    icon: <MdImage />,
    block: () => ({
      type: 'Image',
      data: {
        props: {
          url: 'https://assets.usewaypoint.com/sample-image.jpg',
          alt: 'Sample product',
          contentAlignment: 'middle',
          linkHref: null,
        },
        style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
      },
    }),
  },
  {
    segment: 'Avatar',
    icon: <FaRegUserCircle />,
    block: () => ({
      type: 'Avatar',
      data: {
        props: {
          // Use a static placeholder image that all email clients load reliably
          // Avoid ui-avatars (serves webp sometimes) to ensure deliverability/preview
          imageUrl: 'https://placehold.co/128x128/png?text=Avatar',
          size: 64,
          shape: 'circle',
          alt: 'User avatar',
        },
        style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
      },
    }),
  },
  {
    segment: 'Divider',
    icon: <MdHorizontalRule />,
    block: () => ({
      type: 'Divider',
      data: {
        style: { padding: { top: 16, right: 0, bottom: 16, left: 0 } },
        props: {
          lineColor: '#CCCCCC',
        },
      },
    }),
  },
  {
    segment: 'Spacer',
    icon: <MdCrop32 />,
    block: () => ({
      type: 'Spacer',
      data: {},
    }),
  },
  {
    segment: 'Html',
    icon: <MdOutlineHtml />,
    block: () => ({
      type: 'Html',
      data: {
        props: { contents: '<strong>Hello world</strong>' },
        style: {
          fontSize: 16,
          textAlign: null,
          padding: { top: 16, bottom: 16, left: 24, right: 24 },
        },
      },
    }),
  },
  {
    segment: 'Columns',
    icon: <MdOutlineViewColumn />,
    block: () => ({
      type: 'ColumnsContainer',
      data: {
        props: {
          columnsGap: 16,
          columnsCount: 3,
          columns: [
            { childrenIds: [] },
            { childrenIds: [] },
            { childrenIds: [] },
          ],
        },
        style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
      },
    }),
  },
  {
    segment: 'Container',
    icon: <MdOutlineLibraryAdd />,
    block: () => ({
      type: 'Container',
      data: {
        style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
      },
    }),
  },
];

import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { FaEdit, FaCopy, FaTrash, FaChevronDown } from 'react-icons/fa';
import RenameTemplateModal from './RenameTemplateModal';
import DeleteTemplateModal from './DeleteTemplateModal';
import { useTranslation } from 'react-i18next';

interface TemplateActionDropdownProps {
  templateName: string;
  onRename: (newName: string) => void;
  onCopy: () => void;
  onDelete: () => void;
  onDropdownToggle: (isOpen: boolean) => void;
}

const TemplateActionDropdown: React.FC<TemplateActionDropdownProps> = ({
  templateName,
  onRename,
  onCopy,
  onDelete,
  onDropdownToggle,
}) => {
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRenameModalOpen(true);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopy();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };
  const { t } = useTranslation();

  return (
    <>
      <Menu
        onOpen={() => onDropdownToggle(true)}
        onClose={() => onDropdownToggle(false)}
      >
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<FaChevronDown />}
          color="gray.500"
          variant="ghost"
          size="xs"
          bgColor="transparent"
          _hover={{ bgColor: 'transparent' }}
          _active={{ bgColor: 'transparent' }}
          onClick={handleClick}
        />
        <MenuList
          minWidth="120px"
          bgColor="#C4C3FB"
          onClick={handleClick}
          boxShadow="0 4px 4px 0 rgba(0, 0, 0, 0.25)"
          zIndex={9999}
          border="none"
        >
          <MenuItem
            icon={<FaEdit />}
            onClick={handleRename}
            bgColor="#C4C3FB"
            color="black"
            _hover={{ bgColor: '#E5E5FC' }}
          >
            {t('Rename')}
          </MenuItem>
          <MenuItem
            icon={<FaCopy />}
            onClick={handleCopy}
            bgColor="#C4C3FB"
            color="black"
            _hover={{ bgColor: '#E5E5FC' }}
          >
            {t('Duplicate')}
          </MenuItem>
          <MenuItem
            icon={<FaTrash />}
            onClick={handleDelete}
            bgColor="#C4C3FB"
            color="black"
            _hover={{ bgColor: '#E5E5FC' }}
          >
            {t('Delete')}
          </MenuItem>
        </MenuList>
      </Menu>
      <RenameTemplateModal
        isOpen={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        onSave={(newName) => {
          onRename(newName);
          setIsRenameModalOpen(false);
        }}
        currentName={templateName}
      />
      <DeleteTemplateModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={() => {
          onDelete();
          setIsDeleteModalOpen(false);
        }}
      />
    </>
  );
};

export default TemplateActionDropdown;

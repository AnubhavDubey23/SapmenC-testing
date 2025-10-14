import { useEffect, useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import TEMPLATE_API_ENPOINTS from '@/api/template.api';
import { useAppDispatch, useAppSelector } from '@/store';
import useLogout from '../auth/useLogout';
import Fuse from 'fuse.js';
import { setTemplates } from '@/store/features/templates/templates-slice';
import { TApiResponse } from '@/types/api.types';
import { TTemplate } from '@/types/template.types';

const useTemplates = () => {
  const toast = useToast();
  const { logout } = useLogout();
  const authState = useAppSelector((state) => state.auth);
  const searchBarState = useAppSelector((state) => state.search);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const templatesState = useAppSelector((state) => state.templates);

  const getAllTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(TEMPLATE_API_ENPOINTS.GET_ALL_TEMPLATES, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authState.currentToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data: TApiResponse<TTemplate[]> = await res.json();
      if (!data.status) {
        if (res.status === 401) {
          logout();
          return;
        }
        throw new Error(data.message);
      }

      if (!searchBarState.query) {
        dispatch(setTemplates(data.data));
      } else if (
        searchBarState.query &&
        searchBarState.module === 'templates'
      ) {
        const fuse = new Fuse(templatesState.templates, {
          includeScore: true,
          keys: ['name', 'description', 'subject'],
        });
        const result = fuse.search(searchBarState.query);
        dispatch(setTemplates(data.data));
      }

      return data.data as TTemplate[];
    } catch (error: any) {
      toast({
        title: 'An error occurred while fetching templates',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [authState.currentToken, dispatch, logout, searchBarState.query, searchBarState.module, templatesState.templates, toast]);

  useEffect(() => {
    if (authState.authState && templatesState.templates.length === 0) {
      getAllTemplates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState.authState, templatesState.templates.length]);

  return { loading, getAllTemplates, templates: templatesState.templates };
};

export default useTemplates;

import { useAppDispatch, useAppSelector } from '@/store';
import { useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { setActivesegment } from '@/store/features/selected-segment/selected-segment-slice';
import { setActiveTabState } from '@/store/features/active-tab/active-tab-slice';
import TEMPLATE_API_ENPOINTS from '@/api/template.api';

const useDeleteTemplate = () => {
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);

  const deleteTemplate = async (id: string) => {
    setLoading(true);
    try {
      // Add your delete logic here
      const res = await fetch(TEMPLATE_API_ENPOINTS.DELETE_TEMPLATE(id), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authState.currentToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 204) {
        toast({
          description: 'Template deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      dispatch(
        setActivesegment({
          segmentId: '',
          name: '',
          description: '',
          created_by: {
            name: '',
            email: '',
          },
          updated_by: {
            name: '',
            email: '',
          },
          is_active: false,
          createdAt: '',
          updatedAt: '',
          recipients: [],
        })
      );
      dispatch(setActiveTabState({ tabIndex: 0 }));
    } catch (error: any) {
      console.error(error);
      toast({
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, deleteTemplate };
};

export default useDeleteTemplate;

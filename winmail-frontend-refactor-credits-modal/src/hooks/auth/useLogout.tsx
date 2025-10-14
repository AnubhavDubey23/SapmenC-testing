import { useState } from 'react';
import { useAppDispatch } from '@/store';
import { setActiveTabState } from '@/store/features/active-tab/active-tab-slice';
import { setSidebarState } from '@/store/features/sidebar/sidebar-slice';
import { setActivesegment } from '@/store/features/selected-segment/selected-segment-slice';
import { setActiveTemplate } from '@/store/features/selected-template/selected-template-slice';
import { auth_logout } from '@/store/features/auth/auth-slice';
import { resetsegments } from '@/store/features/segments/segments-slice';
import { resetTemplates } from '@/store/features/templates/templates-slice';
import { openTemplateEditor } from '@/store/features/template-editor/template-editor-slice';
import { useCallback } from 'react';

const useLogout: () => {
  loading: boolean;
  logout: () => void;
} = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const logout = useCallback(() => {
    try {
      setLoading(true);
      dispatch(auth_logout());
      dispatch(
        openTemplateEditor({
          isOpen: false,
          inspectorDrawerOpen: false,
        })
      );
      dispatch(
        setActiveTemplate({
          created_by: {},
          name: '',
          description: '',
          createdAt: '',
          email_data: {},
          is_active: false,
          templateId: '',
          updatedAt: '',
          updated_by: {},
          subject: '',
          is_triggered: false,
          stats: {},
          segments_used: [],
        })
      );
      dispatch(
        setActivesegment({
          createdAt: '',
          created_by: {
            name: '',
            email: '',
          },
          description: '',
          is_active: false,
          segmentId: '',
          name: '',
          recipients: [],
          updatedAt: '',
          updated_by: {
            name: '',
            email: '',
          },
        })
      );
      dispatch(setSidebarState(true));
      dispatch(
        setActiveTabState({
          tabIndex: 0,
        })
      );
      dispatch(resetsegments());
      dispatch(resetTemplates());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  return { loading, logout };
};

export default useLogout;

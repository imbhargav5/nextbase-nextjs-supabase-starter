import { withAppAdminPrivilegesApi } from '@/utils/api-routes/wrappers/withAppAdminPrivilegesApi';
import { NextApiRequest, NextApiResponse } from 'next';
import { enableMaintenanceMode } from '@/utils/supabase-admin';
import { errors } from '@/utils/errors';

const enableMaintenanceModeHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const data = await enableMaintenanceMode();
    res.status(200).json({ data });
  } catch (error) {
    errors.add(error);
    res.status(500).json({ error: error.message });
  }
};

export default withAppAdminPrivilegesApi(enableMaintenanceModeHandler);

import { withAppAdminPrivilegesApi } from '@/utils/api-routes/wrappers/withAppAdminPrivilegesApi';
import { NextApiRequest, NextApiResponse } from 'next';
import { disableMaintenanceMode } from '@/utils/supabase-admin';
import { errors } from '@/utils/errors';

const disableMaintenanceModeHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const data = await disableMaintenanceMode();
    res.status(200).json({ data });
  } catch (error) {
    errors.add(error);
    res.status(500).json({ error: error.message });
  }
};

export default withAppAdminPrivilegesApi(disableMaintenanceModeHandler);

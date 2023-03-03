import { withAppAdminPrivilegesApi } from '@/utils/api-routes/wrappers/withAppAdminPrivilegesApi';
import { NextApiRequest, NextApiResponse } from 'next';
import { getOrganizationsPaginated } from '@/utils/supabase-admin';
import { errors } from '@/utils/errors';

const getOrganizationsPaginatedApi = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { pageNumber: pageNumberString, search: searchQueryParam } = req.query;
  if (typeof pageNumberString === 'string') {
    const pageNumber = Number.parseInt(pageNumberString, 10);
    try {
      const search =
        searchQueryParam && typeof searchQueryParam === 'string'
          ? searchQueryParam
          : undefined;
      const data = await getOrganizationsPaginated(pageNumber, search);
      res.status(200).json(data);
    } catch (error) {
      errors.add(error);
      res.status(500).json({ error: error.message });
    }
    return;
  } else {
    res.status(400).json({ error: 'Invalid userId' });
  }
};

export default withAppAdminPrivilegesApi(getOrganizationsPaginatedApi);

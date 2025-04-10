import { T } from '@/components/ui/Typography';
import { CreatePrivateItemForm } from '../ClientPage';

export default function NewPrivateItemPage() {
    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">
                <T.H1>Create New Private Item</T.H1>
                <T.Subtle>Add a new private item that only you can access</T.Subtle>
            </div>
            <CreatePrivateItemForm />
        </div>
    );
}

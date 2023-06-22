import { Metadata } from 'next';
import Link from 'next/link';
export const metadata: Metadata = {
    title: '404 PAGE NOT FOUND',
};
export default function NotFound() {
    return (
        <div>
            <div>
                <div className="px-9 xl:px-28 mx-auto py-40">
                    <h1 className="text-5xl font-bold text-slate-900 ">
                        404 PAGE NOT FOUND
                    </h1>
                    <div className="flex justify-start mt-9">
                        <Link
                            className="bg-black/20 hover:bg-black/60 hover:backdrop-blur-lg ml-0 px-9 rounded-md text-slate-800 font-bold  py-2  backdrop-blur-sm transition-colors duration-300 ease-in-out "
                            href="/"
                        >
                            Go Back Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

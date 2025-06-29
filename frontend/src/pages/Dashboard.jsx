import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";

const DashboardPage = () => {
	const { user, logout } = useAuthStore();

	const handleLogout = () => {
		logout();
	};
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.9 }}
			transition={{ duration: 0.5 }}
			className='max-w-md w-full mx-5 mt-10 p-8 bg-gray-800 bg-opacity-20 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden'
		>
			<h2 className='text-3xl font-bold text-center bg-[#e6e6e6] text-transparent bg-clip-text mb-6 '>
				Dashboard
			</h2>

			<div className='space-y-6'>
				<motion.div
					className='p-4 bg-gray-900 bg-opacity-30 rounded-lg border border-gray-900'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<h3 className='text-xl font-semibold text-[#e6e6e6] mb-3 underline underline-offset-2'>Profile Information</h3>
					<p className='text-gray-200'>Name: {user.fullName}</p>
					<p className='text-gray-200'>Email: {user.email}</p>
				</motion.div>
				<motion.div
					className='p-4 bg-gray-900 bg-opacity-30 rounded-lg border border-gray-900'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
				>
					<h3 className='text-xl font-semibold text-[#e6e6e6] mb-3 underline underline-offset-2'>Account Activity</h3>
					<p className='text-gray-300'>
						<span className='font-bold'>Joined: </span>
						{new Date(user.createdAt).toLocaleDateString("en-US", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</p>
					<p className='text-gray-300'>
						<span className='font-bold'>Last Login: </span>

						{formatDate(user.lastLogin)}
					</p>
				</motion.div>
			</div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.6 }}
				className='mt-4'
			>
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={handleLogout}
					className='w-full py-3 px-4 bg-[#e6e6e6] text-black font-semibold rounded-lg shadow-md focus:outline-none transition duration-200 mt-4'
				>
					Logout
				</motion.button>
			</motion.div>
		</motion.div>
	);
};
export default DashboardPage;
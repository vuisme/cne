import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useParams} from "react-router-dom";

const AliSocialShare = (props) => {
	const {product, settings} = props;
	const {product_id} = useParams();

	const meta_title = settings?.meta_title || '';
	const site_url = settings?.site_url || '';
	const titleModule = product?.item;

	const title = titleModule?.title ? titleModule?.title : meta_title;
	const link_url = titleModule.num_iid ? `${site_url}/aliexpress/product/${product_id}` : site_url;

	const copyLink = (e, link) => {
		e.preventDefault();
		navigator.clipboard.writeText(link);
		toast.info('Link copied successfully!', {
			position: "bottom-center",
			autoClose: 3000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});
	};

	return (
		<>
			<ToastContainer/>
			<div className="product-details-footer">
				<div className="social-icons social-icons-sm">
					<a
						href={`https://www.facebook.com/share.php?u=${link_url}&title=${title}`}
						className="social-icon facebook"
						rel="noopener noreferrer"
						title="Facebook"
						target="_blank"
					>
						<i className="icon-facebook"/>
					</a>
					<a
						href={`whatsapp://send?text=${link_url}`}
						className="social-icon whatsapp"
						rel="noopener noreferrer"
						title="Whatsapp"
						target="_blank"
					>
						<i className="icon-whatsapp"/>
					</a>
					<a
						className="social-icon messenger"
						href={`fb-messenger://share/?link=${link_url}`}
						data-action="share/messenger/share"
						rel="noopener noreferrer"
						title="Send Messenger"
						target="blank"
					>
						<i className="icon-messenger"/>
					</a>
					<a
						className="social-icon envelope"
						href={`mailto:?subject=chinaexpress.com.bd product url&body=Check out this site ${link_url}`}
						data-action="share/messenger/share"
						rel="noopener noreferrer"
						title="Email"
						target="blank"
					>
						<i className="icon-mail"/>
					</a>
					<a
						className="social-icon copy_link"
						href={link_url}
						onClick={e => copyLink(e, link_url)}
						data-action="share/messenger/share"
						rel="noopener noreferrer"
						title="Copy link"
						target="blank"
					>
						<i className="icon-docs"/>
					</a>
				</div>
			</div>
		</>
	);
};

export default AliSocialShare;
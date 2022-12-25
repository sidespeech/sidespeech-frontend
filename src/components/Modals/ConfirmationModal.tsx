import Button from '../ui-components/Button';
import Modal from '../ui-components/Modal';

interface IConfirmationModal {
	message: string;
	handleConfirm: (value: boolean) => void;
	setIsConfirmationModalOpen: (value: boolean) => void;
}

export default function ConfirmationModal(props: IConfirmationModal) {
	return (
		<Modal
			overflow="visible"
			body={<div>{props.message}</div>}
			footer={
				<div className="flex mt-5 gap-20">
					<Button
						classes=""
						background="var(--red)"
						children={'No'}
						onClick={() => props.handleConfirm(false)}
					/>
					<Button classes="" children={'Yes'} onClick={() => props.handleConfirm(true)} />
				</div>
			}
			showModal={() => props.setIsConfirmationModalOpen(false)}
			title={undefined}
		/>
	);
}

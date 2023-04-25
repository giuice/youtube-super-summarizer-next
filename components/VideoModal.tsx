import React from 'react';
import { Modal } from 'react-bootstrap';

interface VideoModalProps {
  show: boolean;
  onHide: () => void;
  videoId: string;
}

export const VideoModal: React.FC<VideoModalProps> = ({ show, onHide, videoId }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Video</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {videoId && (
          <iframe
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            title="Embedded Video"
          ></iframe>
        )}
      </Modal.Body>
    </Modal>
  );
};

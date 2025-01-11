import cameraIcon from "../../assets/images/authhunter/cameraIcon.svg";
const Authhunter = () => {
  return (
    <>
      <div className="text-on-surface text-t1">
        헌터하기를 완료하신 후,
        <br />
        인증해주세요
      </div>
      <div>
        <img src={cameraIcon} alt="cameraIcon" />
      </div>
      <div>
        <button className="bg-primary text-white">촬영하기</button>
        <button className="bg-primary-container text-white">앨범에서 업로드하기</button>
      </div>
    </>
  );
};

export default Authhunter;

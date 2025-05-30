import { reportMapper } from '../../../data/api-mapper';

export default class ReportDetailPresenter {
  #reportId;
  #view;
  #apiModel;

  constructor(reportId, { view, apiModel }) {
    this.#reportId = reportId;
    this.#view = view;
    this.#apiModel = apiModel;
  }

  async showReportDetailMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showReportDetailMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async showReportDetail() {
    this.#view.showReportDetailLoading();
    try {
      const response = await this.#apiModel.getStoryById(this.#reportId);

      if (!response.ok) {
        console.error('showReportDetail: response:', response);
        this.#view.populateReportDetailError(response.message);
        return;
      }

      const report = await reportMapper(response.story);
      console.log(report); // for debugging purpose, remove after checking it

      this.#view.populateReportDetailAndInitialMap(response.message, report);
    } catch (error) {
      console.error('showReportDetail: error:', error);
      this.#view.populateReportDetailError(error.message);
    } finally {
      this.#view.hideReportDetailLoading();
    }
  }
  async notifyReportOwner(commentId) {
    try {
      const response = await this.#apiModel.sendCommentToReportOwnerViaNotification(
        this.#reportId,
        commentId,
      );
      if (!response.ok) {
        console.error('notifyReportOwner: response:', response);
        return;
      }
      console.log('notifyReportOwner:', response.message);
    } catch (error) {
      console.error('notifyReportOwner: error:', error);
    }
  }

  async notifyMe() {
    try {
      const response = await this.#apiModel.sendReportToMeViaNotification(this.#reportId);
      if (!response.ok) {
        console.error('notifyMe: response:', response);
        return;
      }
      console.log('notifyMe:', response.message);
    } catch (error) {
      console.error('notifyMe: error:', error);
    }
  }

  showSaveButton() {
    if (this.#isReportSaved()) {
      this.#view.renderRemoveButton();
      return;
    }

    this.#view.renderSaveButton();
  }

  #isReportSaved() {
    return false;
  }
}

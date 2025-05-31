import { reportMapper } from '../../../data/api-mapper';

export default class ReportDetailPresenter {
  #reportId;
  #view;
  #apiModel;
  #dbModel;

  constructor(reportId, { view, apiModel, dbModel }) {
    this.#reportId = reportId;
    this.#view = view;
    this.#apiModel = apiModel;
    this.#dbModel = dbModel;
  }

  async showReportDetailMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('Map: error:', error);
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
      await this.showSaveButton();
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

  async saveReport() {
    try {
        const response = await this.#apiModel.getStoryById(this.#reportId);
        if (!response.ok) {
        throw new Error(response.message || 'Gagal mengambil data report.');
      }

      const report = await reportMapper(response.story); 
      await this.#dbModel.putReport(report);
      this.#view.saveToBookmarkSuccessfully('Success to save to bookmark');
    } catch (error) {
      console.error('saveReport: error:', error);
      this.#view.saveToBookmarkFailed(error.message);
    }
  }

  async removeReport() {
    try {
      await this.#dbModel.removeReport(this.#reportId);
      this.#view.removeFromBookmarkSuccessfully('Success to remove from bookmark');
    } catch (error) {
      console.error('removeReport: error:', error);
      this.#view.removeFromBookmarkFailed(error.message);
    }
  }

  async showSaveButton() {
    if (await this.#isReportSaved()) {
      this.#view.renderRemoveButton();
      return;
    }
    this.#view.renderSaveButton();
  }

  async #isReportSaved() {
    return !!(await this.#dbModel.getStoryById(this.#reportId));
  }
}
